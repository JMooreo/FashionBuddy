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
    await db
      .collection("Contests")
      .doc(contestId)
      .collection("Options")
      .doc(optionName)
      .set({ imageUrl: signedUrls[0] })
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
  });
