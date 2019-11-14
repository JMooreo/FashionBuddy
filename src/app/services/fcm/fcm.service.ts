import { Injectable } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor(private fcm: FCM) {}

  async getCloudMessagingToken(): Promise<string> {
    return await this.fcm.getToken();
  }
}
