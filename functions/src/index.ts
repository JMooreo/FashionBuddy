import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { tmpdir } from "os";
import { join, dirname } from "path";

import * as sharp from "sharp";
import * as fs from "fs-extra";

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async object => {
    if (object.name) {
      const bucket = admin.storage().bucket(object.bucket);
      const filePath = object.name;
      const fileName = filePath.split("/").pop();
      const bucketDir = dirname(filePath);

      const workingDir = join(tmpdir(), "thumbs");
      const tmpFilePath = join(workingDir, "source.jpeg");

      if (
        (fileName && fileName.includes("thumb@")) ||
        (object.contentType && !object.contentType.includes("image"))
      ) {
        console.log("exiting function");
        return false;
      }

      await fs.ensureDir(workingDir);

      await bucket.file(filePath).download({
        destination: tmpFilePath
      });

      const sizes = [64, 128, 256];

      const uploadPromises = sizes.map(async size => {
        const thumbName = `thumb@${size}_${fileName}`;
        const thumbPath = join(workingDir, thumbName);

        await sharp(tmpFilePath)
          .resize(size, size)
          .toFile(thumbPath);

        return bucket.upload(thumbPath, {
          destination: join(bucketDir, thumbName)
        });
      });

      await Promise.all(uploadPromises);

      return fs.remove(workingDir);
    }
  });
