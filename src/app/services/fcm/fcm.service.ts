import { Injectable } from "@angular/core";
// import { FCM } from "@ionic-native/fcm/ngx";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor() // private fcm: FCM
  {}

  async getCloudMessagingToken(): Promise<string> {
    const token = "fcm plugin not installed";
    // await this.fcm.getToken();
    console.log("Token:", token);
    return token;
  }
}
