/* Firebase Imports */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

//#region Thumbnail Generator (Storage)
import { tmpdir } from "os";
import { join, dirname } from "path";

import * as sharp from "sharp";
import * as fs from "fs-extra";

export const generateThumbs = functions.storage.object().onFinalize(async object => {
  const db = admin.firestore();
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name ? object.name : "undefined";
  console.log("file path", filePath);
  const pathSplitAtSlashes = filePath.split("/");
  const fileName = pathSplitAtSlashes[pathSplitAtSlashes.length - 1];
  console.log("fileName", fileName);
  const contestId = pathSplitAtSlashes[pathSplitAtSlashes.length - 2];
  console.log("contestId", contestId);
  const pathSplitAtContestId = filePath.split(`${contestId}_`);
  const optionName = pathSplitAtContestId[pathSplitAtContestId.length - 1];
  console.log("optionName", optionName);
  const bucketDir = dirname(filePath);
  console.log(`bucketDir for ${optionName}`, bucketDir);

  const workingDir = join(tmpdir(), `thumbs_${contestId}_${optionName}`);
  console.log(`workingDir for ${optionName}`, workingDir);
  const tmpFilePath = join(
    workingDir,
    `source_${contestId}_${optionName}.jpeg`
  );
  console.log(`tmpFilePath for ${optionName}`, tmpFilePath);

  if (
    (fileName && fileName.includes("thumb@")) ||
    (object.contentType && !object.contentType.includes("image"))
  ) {
    console.log("exiting function");
    return false;
  }

  await fs.ensureDir(workingDir);
  console.log("ensuring workingDir", workingDir);

  await bucket.file(filePath).download({
    destination: tmpFilePath
  });
  console.log(
    `downloaded ${filePath} for ${optionName} to destination ${tmpFilePath}`
  );

  const sizes = [{ width: 200, height: 450 }];

  const uploadPromises = sizes.map(async size => {
    const thumbName = `thumb@${size.width}x${size.height}_${fileName}.jpeg`;
    const thumbPath = join(workingDir, thumbName);

    await sharp(tmpFilePath)
      .resize(size.width, size.height)
      .toFile(thumbPath);

    return bucket.upload(thumbPath, {
      destination: join(bucketDir, thumbName)
    });
  });

  await Promise.all(uploadPromises);

  const signedUrls = await bucket
    .file(join(bucketDir, `thumb@200x450_${fileName}.jpeg`))
    .getSignedUrl({
      action: "read",
      expires: "03-09-2491"
    });

  console.log("updating cloud firestore imageUrls", contestId, optionName);

  const contestDoc = await db
    .collection("Contests")
    .doc(contestId)
    .get();
  console.log("Contest Doc = ", contestDoc);
  const contestData = contestDoc.data();
  console.log("Contest Data = ", contestData);
  if (contestData && contestData.options) {
    const optionId = parseInt(optionName.split("_")[1]);
    console.log("optionId = ", optionId);
    let optionToRemove = {};
    contestData.options.forEach((option: { imageUrl: string; votes: number }) => {
      if (option.imageUrl.includes(optionName)) {
        optionToRemove = option;
      }
    });

    console.log("Attempting to remove option", optionToRemove);

    await db
      .collection("Contests")
      .doc(contestId)
      .update({
        options: admin.firestore.FieldValue.arrayRemove({
          ...optionToRemove
        })
      });

    const optionToAdd = { ...optionToRemove, imageUrl: signedUrls[0] };

    console.log("Attempting to add option", optionToAdd);

    await db
      .collection("Contests")
      .doc(contestId)
      .update({
        options: admin.firestore.FieldValue.arrayUnion({ ...optionToAdd })
      });
  }
  return fs.remove(workingDir);
});
//#endregion

//#region New Contest Notifier (onCreate 'Contests/{contestID}')
import { sendNotificationToTopic } from './NotiSender'
import { areImagesOnConstestLegal } from './ContestPicFilter'

export const sendNewContestNotification = functions.firestore.document('Contests/{contestID}').onCreate(async (snapshot, context) => {
  sendNotificationToTopic('post-notifications', snapshot)

  return null
  // // * Check the 2 images if they are related to fashion
  // const is_valid = await areImagesOnConstestLegal(snapshot)

  // console.log("Google says the 2 images are valid:", is_valid)

  // if (is_valid) { sendNotificationToTopic('post-notifications', snapshot); return null }
  // else if (is_valid === null) { console.log("Google has bad news"); return null }
  // else {
  //   // * Move the contest to a new place 
  //   const db = admin.firestore();

  //   console.log("Move the contest to a new place")

  //   // * Just to be safe
  //   if (snapshot.data()['closeDateTime'] === undefined) { console.log("snapshot.data()['closeDateTime'] is undefined"); return }
  //   if (snapshot.data()['contestOwner'] === undefined) { console.log("snapshot.data()['contestOwner'] is undefined"); return }
  //   if (snapshot.data()['createDateTime'] === undefined) { console.log("snapshot.data()['createDateTime'] is undefined"); return }
  //   if (snapshot.data()['occasion'] === undefined) { console.log("snapshot.data()['occasion'] is undefined"); return }
  //   if (snapshot.data()['reportCount'] === undefined) { console.log("snapshot.data()['reportCount'] is undefined"); return }
  //   if (snapshot.data()['style'] === undefined) { console.log("snapshot.data()['style'] is undefined"); return }
  //   if (snapshot.data()['options'] === undefined) { console.log("snapshot.data()['options'] is undefined"); return }
  //   if (snapshot.data()['seenUsers'] === undefined) { console.log("snapshot.data()['seenUsers'] is undefined"); return }

  //   // * Move it to SuspectedContests
  //   await db.collection('SuspectedContests').doc(context.params['contestID']).set({
  //     closeDateTime: snapshot.data()['closeDateTime'],
  //     contestOwner: snapshot.data()['contestOwner'],
  //     createDateTime: snapshot.data()['createDateTime'],
  //     occasion: snapshot.data()['occasion'],
  //     reportCount: snapshot.data()['reportCount'],
  //     style: snapshot.data()['style'],
  //     options: snapshot.data()['options'],
  //     seenUsers: snapshot.data()['seenUsers']
  //   })

  //   // * Delete the document to wait for checking
  //   console.log("Deleting document")
  //   await db.collection('Contests').doc(context.params['contestID']).delete()

  //   return null
  // }
})
//#endregion

//#region Options Syncer (onCreate 'Contests/{contestID}/Voters/{voterID}')
export const syncVotersToOptions = functions.firestore.document('Contests/{contestID}/Voters/{voterID}').onCreate((snapshot, context) => {
  const db = admin.firestore();

  console.log("Received vote for:", snapshot.data()['votedFor']);

  // * Get the option user voted for (can be 'report')
  const chosenOption = snapshot.data()['votedFor']

  // * The voter's id
  const voterID = snapshot.id

  console.log("Chosen option:", chosenOption)
  console.log("Detected contestID:", context.params['contestID'])

  // * Update report count or vote count for option
  db.collection('Contests').doc(context.params['contestID']).get().then(doc => {
    const previousOptions = doc.data()['options']
    const previousSeenUsers = doc.data()['seenUsers']
    let lastReportCount = doc.data()['reportCount']

    if (chosenOption === "report") {
      lastReportCount += 1
    }
    else {
      const chosenIndex = parseInt(chosenOption[chosenOption.length - 1]) - 1
      const previousChosenOption = previousOptions[chosenIndex]

      const lastVote = previousChosenOption['votes']
      const newVote = lastVote + 1

      previousOptions[chosenIndex]['votes'] = newVote
    }

    previousSeenUsers.push(voterID)

    db.collection('Contests').doc(context.params['contestID']).update({
      options: previousOptions,
      seenUsers: previousSeenUsers,
      reportCount: lastReportCount
    }).then(() => {
      return null
    }).catch((err) => {
      console.log(err)
      return null
    })
  }).catch((err) => {
    console.log(err)
    return null
  })
});
//#endregion

//#region Contest Screener (onUpdate 'Contests/{contestID}')
export const contestScreening = functions.firestore.document('Contests/{contestID}').onUpdate((change, context) => {
  // * Trivial reference
  const db = admin.firestore();

  // * Retrieve the current and previous value
  const data = change.after.data();
  const previousData = change.before.data();

  // * Screening
  try {
    if (data['reportCount'] === previousData['reportCount']) {
      console.log("Reject 1")
      return null
    }
    if (data['reportCount'] <= 3) {
      console.log("Reject 2")
      return null
    }
  }
  catch (err) {
    console.log("Reject 3 with error:", err)
    return null
  }

  console.log("All tests passed to delete")

  // * Move all fields to ReportedContests
  db.collection('ReportedContests').doc(context.params['contestID']).set({
    closeDateTime: data['closeDateTime'],
    contestOwner: data['contestOwner'],
    createDateTime: data['createDateTime'],
    occasion: data['occasion'],
    reportCount: data['reportCount'],
    style: data['style'],
    options: data['options'],
    seenUsers: data['seenUsers']
  }).then(async () => {
    const votersSnap = await db.collection('Contests').doc(context.params['contestID']).collection('Voters').get()

    votersSnap.forEach(async (voterDoc) => {
      let lastTimestamp = voterDoc.data()['timestamp']
      const lastVotedFor = voterDoc.data()['votedFor']

      if (lastTimestamp === undefined) {
        lastTimestamp = 0
      }

      await db.collection('ReportedContests').doc(context.params['contestID']).collection('Voters').doc(voterDoc.id).set({
        timestamp: lastTimestamp,
        votedFor: lastVotedFor
      })

      // ? FIXME: For some reason this line doesn't make any difference
      // await db.collection('Contests').doc(context.params['contestID']).collection('Voters').doc(voterDoc.id).delete()
    })

    console.log("Deleting document")
    await db.collection('Contests').doc(context.params['contestID']).delete()

    console.log("Success I guess");
    return 0
  }).catch((err) => {
    console.log("Ok error here we meet again:", err);
    return null
  });
});
//#endregion