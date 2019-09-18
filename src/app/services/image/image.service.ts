import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file/ngx";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(private file: File) {}

  getFolderPath(imagePath) {
    return imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
  }

  getCurrentName(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);

    if (currentName.indexOf("?") > -1) {
      currentName = currentName.substr(0, currentName.lastIndexOf("?"));
    }
    return currentName;
  }
}
