import { Injectable, OnInit } from "@angular/core";
import * as firebase from "firebase/app";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class StorageService implements OnInit {
  storageRef = firebase.storage().ref();

  constructor(private authSrv: AuthService) {}

  ngOnInit() {}

  async uploadImage(imageData: string, imageName: string, contestId: string): Promise<string> {
    const userId = this.authSrv.getUserId();
    const userImagesRef = this.storageRef.child(
      `images/${userId}/${contestId}/${imageName}`
    );
    const snapshot = await userImagesRef.putString(imageData, "data_url");
    const downloadUrl = await snapshot.ref.getDownloadURL();
    return downloadUrl;
  }
}
