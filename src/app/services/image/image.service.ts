import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file/ngx";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(
    private file: File,
  ) {}

  saveImage(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
    const folderPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);

    if (currentName.indexOf("?") > -1) {
      currentName = currentName.substr(0, currentName.lastIndexOf("?"));
    }

    return this.copyFileToLocalDir(folderPath, currentName, `${new Date().getTime()}.png`);
  }

  copyFileToLocalDir(folderPath, currentName, newFileName) {
    return this.file
      .copyFile(folderPath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          console.log(newFileName);
          return newFileName;
        },
        error => {
          console.log("error:", error);
        }
      );
  }
}
