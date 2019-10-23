import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import "firebase/messaging";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor() {}

  async getCloudMessagingToken(): Promise<string> {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await firebase.messaging().getToken();
    } else {
      return "";
    }
  }
}
