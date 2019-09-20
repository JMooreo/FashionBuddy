import { Injectable, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class StorageService implements OnInit {
  storageRef = firebase.storage().ref();

  constructor(private authSrv: AuthService) {}

  ngOnInit() {}

  async uploadImage(imageData: string, imageName: string): Promise<string> {
    const userId = this.authSrv.getUserId();
    const userImagesRef = this.storageRef.child(
      `images/${userId}/${imageName}`
    );

    const snapshot = await userImagesRef.putString(imageData, "data_url");
    const downloadUrl = await snapshot.ref.getDownloadURL();

    return downloadUrl;

    // uploadTask.on(
    //   firebase.storage.TaskEvent.STATE_CHANGED,
    //   snapshot => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //   },
    //   error => {
    //     console.error(error);
    //   },
    //   () => {
    //     // Upload completed successfully, now we can get the download URL
    //     uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
    //       console.log("downloadUrl", downloadUrl);
    //     });
    //   }
    // );
  }
}
