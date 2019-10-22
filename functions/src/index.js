"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();
//#region Justin's function
/*
import { tmpdir } from "os";
import { join, dirname } from "path";

import * as sharp from "sharp";
import * as fs from "fs-extra";

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
    await db
      .collection("Contests")
      .doc(contestId)
      .collection("Options")
      .doc(optionName)
      .update({ imageUrl: signedUrls[0] })
      .then(
        success => {
          console.log("Successful firebase update");
        },
        error => {
          console.error(error);
        }
      );
    console.log("removing working Directory", workingDir);
    return fs.remove(workingDir);
  });*/
//#endregion
//#region firebase deploy --only functions:contestScreening
/*
export const contestScreening = functions.firestore.document('Contests/{contestID}').onUpdate((change, context) => {
  const db = admin.firestore()

  // Retrieve the current and previous value
  const data = change.after.data();
  const previousData = change.before.data();

  try {
    if (data['reportCount'] === previousData['reportCount']) {
      return null;
    }
    if (data['reportCount'] <= 3) {
      return null;
    }
  }
  catch (err) {
    console.log("Hello I'm Mr.Werid:", err)
    return null;
  }

  db.collection('ReportedContests').doc(context.params['contestID']).set({
    closeDateTime: data['closeDateTime'],
    contestOwner: data['contestOwner'],
    createDateTime: data['createDateTime'],
    occasion: data['occasion'],
    reportCount: data['reportCount'],
    style: data['style']
  }).then(() => {
    console.log("Success I guess")
  }).catch((err) => {
    console.log("Ok error here we meet again:", err)
  })

  return 0;
})*/
//#endregion
//#region Convert Collection to Map field
/*
export const convertCollection = functions.firestore.document('Conversions/{conversionID}').onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  const original = snapshot.data();

  if (original) {
    const db = admin.firestore()

    const savedVoters = {}

    db.collection('Contests').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        db.collection(`Contests/${doc.id}/Voters`).get().then(optionsQuerySnapshot => {
          optionsQuerySnapshot.forEach(optionDoc => {
            savedVoters[optionDoc.id] = optionDoc.data()
          })

          db.collection(`Contests`).doc(doc.id).update({
            voters: savedVoters,
          }).then(() => {
            console.log("Success updating voters")
          }).catch((err) => {
            console.log("Error 1:", err)
          })
        }).then(() => {
          console.log("Success updating voters")
        }).catch((err) => {
          console.log("Error 2:", err)
        })
      })
    }).then(() => {
      console.log("Success updating voters")
    }).catch((err) => {
      console.log("Error 1:", err)
    })

    return 0;
  }
})*/
//#endregion
//#region Map Field Seen User
// export const votersToArrayOneTimeOnly = functions.firestore.document('VoteConvert/{voteID}').onCreate((snapshot, context) => {
//   return new Promise((resolve, reject) => {
//     const db = admin.firestore()
//     db.collection('Contests').get().then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//         const seenVoters = []
//         db.collection(`Contests/${doc.id}/Voters`).get().then(votersQuerySnapshot => {
//           votersQuerySnapshot.forEach(voterDoc => {
//             seenVoters.push(voterDoc.id)
//           })
//           db.collection('Contests').doc(doc.id).update({
//             seenUsers: seenVoters
//           }).then(() => {
//             console.log("Success")
//             resolve()
//           }).catch((err) => {
//             console.log("error 1")
//             reject(err)
//           })
//         }).catch((err) => {
//           console.log("error 1")
//           reject(err)
//         }).catch((err) => {
//           console.log("error 1")
//           reject(err)
//         })
//       })
//     }).catch((err) => {
//       console.log("error 1")
//       reject(err)
//     })
//   })
// })
//#endregion
exports.syncVotersToOptions = functions.firestore.document('Contests/{contestID}/Voters/{voterID}').onCreate((snapshot, context) => {
    return new Promise((resolve, reject) => {
        const db = admin.firestore();
        console.log(snapshot.data()['votedFor']);
        resolve();
    });
});
