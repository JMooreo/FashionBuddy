import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

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
