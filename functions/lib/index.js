"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
//#region Justin's function
const os_1 = require("os");
const path_1 = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");
exports.generateThumbs = functions.storage.object().onFinalize(async (object) => {
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
    const bucketDir = path_1.dirname(filePath);
    console.log(`bucketDir for ${optionName}`, bucketDir);
    const workingDir = path_1.join(os_1.tmpdir(), `thumbs_${contestId}_${optionName}`);
    console.log(`workingDir for ${optionName}`, workingDir);
    const tmpFilePath = path_1.join(workingDir, `source_${contestId}_${optionName}.jpeg`);
    console.log(`tmpFilePath for ${optionName}`, tmpFilePath);
    if ((fileName && fileName.includes("thumb@")) ||
        (object.contentType && !object.contentType.includes("image"))) {
        console.log("exiting function");
        return false;
    }
    await fs.ensureDir(workingDir);
    console.log("ensuring workingDir", workingDir);
    await bucket.file(filePath).download({
        destination: tmpFilePath
    });
    console.log(`downloaded ${filePath} for ${optionName} to destination ${tmpFilePath}`);
    const sizes = [{ width: 200, height: 450 }];
    const uploadPromises = sizes.map(async (size) => {
        const thumbName = `thumb@${size.width}x${size.height}_${fileName}.jpeg`;
        const thumbPath = path_1.join(workingDir, thumbName);
        await sharp(tmpFilePath)
            .resize(size.width, size.height)
            .toFile(thumbPath);
        return bucket.upload(thumbPath, {
            destination: path_1.join(bucketDir, thumbName)
        });
    });
    await Promise.all(uploadPromises);
    const signedUrls = await bucket
        .file(path_1.join(bucketDir, `thumb@200x450_${fileName}.jpeg`))
        .getSignedUrl({
        action: "read",
        expires: "03-09-2491"
    });
    console.log("updating cloud firestore imageUrls", contestId, optionName);
    const chosenIndex = parseInt(optionName[optionName.length - 1]) - 1;
    const doc = await db.collection('Contests').doc(contestId).get();
    const previousOptions = doc.data()['options'];
    previousOptions[chosenIndex]['imageUrl'] = signedUrls[0];
    await db.collection("Contests").doc(contestId).update({
        options: previousOptions
    }).then(() => {
        console.log("Successful firebase update");
    }, error => {
        console.error(error);
    });
    console.log("removing working Directory", workingDir);
    return fs.remove(workingDir);
});
//#endregion
exports.syncVotersToOptions = functions.firestore.document('Contests/{contestID}/Voters/{voterID}').onCreate((snapshot, context) => {
    const db = admin.firestore();
    console.log("Received vote for:", snapshot.data()['votedFor']);
    console.log("Begin updating options");
    const chosenOption = snapshot.data()['votedFor'];
    const voterID = snapshot.id;
    if (chosenOption === "report") {
        console.log("It's a report flag! Updating report count...");
    }
    console.log("Detected contestID:", context.params['contestID']);
    db.collection('Contests').doc(context.params['contestID']).get().then(doc => {
        const previousOptions = doc.data()['options'];
        const previousSeenUsers = doc.data()['seenUsers'];
        let lastReportCount = doc.data()['reportCount'];
        if (chosenOption === "report") {
            lastReportCount += 1;
        }
        else {
            const chosenIndex = parseInt(chosenOption[chosenOption.length - 1]) - 1;
            const previousChosenOption = previousOptions[chosenIndex];
            const lastVote = previousChosenOption['votes'];
            const newVote = lastVote + 1;
            previousOptions[chosenIndex]['votes'] = newVote;
        }
        previousSeenUsers.push(voterID);
        db.collection('Contests').doc(context.params['contestID']).update({
            options: previousOptions,
            seenUsers: previousSeenUsers,
            reportCount: lastReportCount
        }).then(() => {
            return 0;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    }).catch((err) => {
        console.log(err);
        return null;
    });
});
//#region firebase deploy --only functions:contestScreening
exports.contestScreening = functions.firestore.document('Contests/{contestID}').onUpdate((change, context) => {
    // * Trivial reference
    const db = admin.firestore();
    // * Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();
    // * Screening
    try {
        if (data['reportCount'] === previousData['reportCount']) {
            console.log("Reject 1");
            return null;
        }
        if (data['reportCount'] <= 3) {
            console.log("Reject 2");
            return null;
        }
    }
    catch (err) {
        console.log("Reject 3 with error:", err);
        return null;
    }
    console.log("All tests passed to delete");
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
        const votersSnap = await db.collection('Contests').doc(context.params['contestID']).collection('Voters').get();
        votersSnap.forEach(async (voterDoc) => {
            let lastTimestamp = voterDoc.data()['timestamp'];
            const lastVotedFor = voterDoc.data()['votedFor'];
            if (lastTimestamp === undefined) {
                lastTimestamp = 0;
            }
            await db.collection('ReportedContests').doc(context.params['contestID']).collection('Voters').doc(voterDoc.id).set({
                timestamp: lastTimestamp,
                votedFor: lastVotedFor
            });
            // ? FIXME: For some reason this line doesn't make any difference
            // await db.collection('Contests').doc(context.params['contestID']).collection('Voters').doc(voterDoc.id).delete()
        });
        console.log("Deleting document");
        await db.collection('Contests').doc(context.params['contestID']).delete();
        console.log("Success I guess");
        return 0;
    }).catch((err) => {
        console.log("Ok error here we meet again:", err);
        return null;
    });
});
//#endregion
//#endregion
//#region Convert Collection to Map field
/*
exports.convertCollectionVoters = functions.firestore.document('Conversions/{conversionID}').onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  return new Promise((resolve, reject) => {
    const original = snapshot.data();
    if (original) {
      const db = admin.firestore();
      const savedVoters = {};
      db.collection('Contests').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          db.collection(`Contests/${doc.id}/Voters`).get().then(optionsQuerySnapshot => {
            optionsQuerySnapshot.forEach(optionDoc => {
              savedVoters[optionDoc.id] = optionDoc.data();
            });
            db.collection(`Contests`).doc(doc.id).update({
              voters: savedVoters,
            }).then(() => {
              console.log("Success updating voters MAX");
              resolve()
            }).catch((err) => {
              console.log("Error 1:", err);
              reject(err)
            });
          }).then(() => {
            console.log("Success updating voters 1 ");
          }).catch((err) => {
            console.log("Error 2:", err);
            reject(err)
          });
        });
      }).then(() => {
        console.log("Success updating voters 0");
      }).catch((err) => {
        console.log("Error 1:", err);
        reject(err)
      });
    }

  })

});

exports.convertCollectionOptions = functions.firestore.document('Conversion/{conversionID}').onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  return new Promise((resolve, reject) => {
    const original = snapshot.data();
    if (original) {
      const db = admin.firestore();
      const savedOptions = {};
      db.collection('Contests').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          db.collection(`Contests/${doc.id}/Options`).get().then(optionsQuerySnapshot => {
            optionsQuerySnapshot.forEach(optionDoc => {
              savedOptions[optionDoc.id] = optionDoc.data();
            });
            db.collection(`Contests`).doc(doc.id).update({
              options: savedOptions,
            }).then(() => {
              console.log("Success updating options MAX");
              resolve()
            }).catch((err) => {
              console.log("Error 1:", err);
              reject(err)
            });
          }).then(() => {
            console.log("Success updating options 1 ");
          }).catch((err) => {
            console.log("Error 2:", err);
            reject(err)
          });
        });
      }).then(() => {
        console.log("Success updating options 0");
      }).catch((err) => {
        console.log("Error 1:", err);
        reject(err)
      });
    }

  })

});
*/
//#endregion
//# sourceMappingURL=index.js.map
// exports.votersToArrayOneTimeOnly = functions.firestore.document('VoteConvert/{voteID}').onCreate((snapshot, context) => {
//   return new Promise((resolve, reject) => {
//     const db = admin.firestore();
//     db.collection('Contests').get().then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//         const seenVoters = [];
//         db.collection(`Contests/${doc.id}/Voters`).get().then(votersQuerySnapshot => {
//           votersQuerySnapshot.forEach(voterDoc => {
//             seenVoters.push(voterDoc.id);
//           });
//           db.collection('Contests').doc(doc.id).update({
//             seenUsers: seenVoters
//           }).then(() => {
//             console.log("Success");
//             resolve();
//           }).catch((err) => {
//             console.log("error 1");
//             reject(err);
//           });
//         }).catch((err) => {
//           console.log("error 1");
//           reject(err);
//         }).catch((err) => {
//           console.log("error 1");
//           reject(err);
//         });
//       });
//     }).catch((err) => {
//       console.log("error 1");
//       reject(err);
//     });
//   });
// });
// exports.fixOptionsField = functions.firestore.document('FixOptions/{fixID}').onCreate((snapshot, context) => {
//   return new Promise((resolve, reject) => {
//     const db = admin.firestore()
//     let count = 0
//     db.collection('Contests').get().then((querySnapshot) => {
//       querySnapshot.forEach(doc => {
//         return new Promise((s_resolve, s_reject) => {
//           let saved_options = []
//           saved_options.push(doc.data()['options']['option_1'])
//           saved_options.push(doc.data()['options']['option_2'])
//           db.collection('Contests').doc(doc.id).update({
//             options: saved_options
//           }).then(() => {
//             count += 1
//             s_resolve()
//           })
//         })
//       })
//     })
//   })
// })
//# sourceMappingURL=index.js.map