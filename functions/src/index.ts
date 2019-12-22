import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { tmpdir } from "os";
import { join, dirname } from "path";

import * as sharp from "sharp";
import * as fs from "fs-extra";

const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  authenticator: new IamAuthenticator({
    apikey: 'SpZ7UhooJuAGCPAUFs8SX87A_zlbSR7xXEc8E2hjd-6f',
  }),
  url: 'https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/b2808d59-0d0a-44f4-9e6d-1b560a360718',
});

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async object => {
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



export const sendNotificationToTopic = (topic: string, snapshot: FirebaseFirestore.DocumentSnapshot) => {
  const time = new Date()

  const currentHour = time.getHours()

  const period = (currentHour >= 6 && currentHour <= 10) ? "morning" : (currentHour > 10 && currentHour <= 17) ? "noon" : "night"

  let title = ""

  switch (period) {
    case "morning":
      title = "Morning's here!";
      break;
    case "noon":
      title = "Howdy!";
      break;
    default:
      title = "The moon is lovely tonight!";
      break;
  }

  title = "This is exciting!!!"

  if (snapshot.data() !== undefined) {
    const message = {
      data: {
        userId: snapshot.data()['contestOwner']
      },
      notification: {
        title: title,
        body: "Hey there's a new outfit! Come VOTE 😃",
      },
      topic: topic
    };

    admin.messaging().send(message).then((response: any) => {
      console.log('Successfully sent message:', response);
    }).catch((err: any) => {
      console.log('Error sending message:', err);
    })
  }
  else {
    console.log("snapshot.data() is undefined")
  }
}

export const areImagesOnConstestLegal = function (snapshot: FirebaseFirestore.DocumentSnapshot) {
  return new Promise((resolve, reject) => {
    const firstImageURL = snapshot.data()['options'][0]['imageUrl']
    const secondImageURL = snapshot.data()['options'][1]['imageUrl']

    const firstClassifyParams = {
      url: firstImageURL,
    };

    const secondClassifyParams = {
      url: secondImageURL,
    };

    /* Make sure the classified image have a clothing type keyword */
    const validKeywords = ['garment', 'jacket', 'skirt', 'breeches', 'trouser', 'pants', 'clothing', 'fabric', 'dress', 'shorts', 'footwear', 'outfit', 'revers', 'polo', 'shirt', 'sleeve', 'T-shirt', 'waistcoat', 'cardigan', 'jacket', 'sweater', 'vest', 'pocket', 'flannel', 'tartan', 'lumberjack', 'coat', 'overgarment', 'shoes']

    let isValidOne = false
    let isValidTwo = false

    visualRecognition.classify(firstClassifyParams).then(firstResponse => {
      visualRecognition.classify(secondClassifyParams).then(secondResponse => {
        const firstClassifiedImages = firstResponse.result;
        const secondClassifiedImages = secondResponse.result;

        if (firstClassifiedImages['images'].length === 0 || secondClassifiedImages['images'].length === 0) { resolve(false) }
        if (firstClassifiedImages['images'][0]['classifiers'][0].length === 0 || secondClassifiedImages['images'][0]['classifiers'][0].length === 0) { resolve(false) }
        if (firstClassifiedImages['images'][0]['classifiers'][0]['classes'].length === 0 || secondClassifiedImages['images'][0]['classifiers'][0]['classes'].length === 0) { resolve(false) }

        const allClassesFirst = firstClassifiedImages['images'][0]['classifiers'][0]['classes'].map(detectedClass => {
          return detectedClass['class']
        })

        const allClassesSecond = secondClassifiedImages['images'][0]['classifiers'][0]['classes'].map(detectedClass => {
          return detectedClass['class']
        })

        allClassesFirst.forEach(detectedClass => {
          if (isValidOne) { return }
          validKeywords.forEach(validKey => {
            if (detectedClass.toLowerCase().includes(validKey.toLowerCase())) {
              isValidOne = true
            }
          })
        })

        allClassesSecond.forEach(detectedClass => {
          if (isValidTwo) { return }
          validKeywords.forEach(validKey => {
            if (detectedClass.toLowerCase().includes(validKey.toLowerCase())) {
              isValidTwo = true
            }
          })
        })

        if (isValidOne && isValidTwo) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      }).catch(err => {
        console.log('error:', err);
        reject(err)
      });
    }).catch(err => {
      console.log('error:', err);
      reject(err)
    });
  })

}

export const sendNewContestNotification = functions.firestore.document('Contests/{contestID}').onCreate((snapshot, context) => {
  return new Promise((resolve, reject) => {
    areImagesOnConstestLegal(snapshot).then((is_valid) => {
      console.log("Should I send notification:", is_valid)

      if (is_valid) {
        /* ! Tell everyone */
        sendNotificationToTopic('post-notifications', snapshot)
      }
      else {
        /* Move the contest to a new place */
        const db = admin.firestore();

        db.collection('SuspectedContests').doc(context.params['contestID']).set({
          closeDateTime: snapshot.data()['closeDateTime'],
          contestOwner: snapshot.data()['contestOwner'],
          createDateTime: snapshot.data()['createDateTime'],
          occasion: snapshot.data()['occasion'],
          reportCount: snapshot.data()['reportCount'],
          style: snapshot.data()['style'],
          options: snapshot.data()['options'],
          seenUsers: snapshot.data()['seenUsers']
        }).then(async () => {
          console.log("Deleting document")
          db.collection('Contests').doc(context.params['contestID']).delete().then(() => {
            resolve()
          }).catch((err) => {
            console.log("Ok error here we meet again:", err);
            reject(err);
          })
        }).catch((err) => {
          console.log("Ok error here we meet again:", err);
          reject(err);
        });
      }
    }).catch((err) => {
      console.log("Ok error here we meet again:", err);
      reject(err);
    })
  })
})

export const syncVotersToOptions = functions.firestore.document('Contests/{contestID}/Voters/{voterID}').onCreate((snapshot, context) => {
  const db = admin.firestore();

  console.log("Received vote for:", snapshot.data()['votedFor']);
  console.log("Begin updating options")

  const chosenOption = snapshot.data()['votedFor']
  const voterID = snapshot.id

  if (chosenOption === "report") {
    console.log("It's a report flag! Updating report count...")
  }

  console.log("Detected contestID:", context.params['contestID'])

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
      return 0
    }).catch((err) => {
      console.log(err)
      return null
    })
  }).catch((err) => {
    console.log(err)
    return null
  })
});

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