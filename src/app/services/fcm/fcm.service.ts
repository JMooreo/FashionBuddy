import { Injectable } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";
import { IonicPopupsService } from "../popups/ionic-popups.service";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor(private fcm: FCM, private popupSrv: IonicPopupsService) {}

  doNotificationSetup() {
    // Subscribe to Post Notifications
    this.fcm.subscribeToTopic("post-notifications");

    // Listen For Token Refreshes
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("Token Refreshed", token);
    });

    // Listen For Notifications
    this.fcm.onNotification().subscribe(data => {
      if (!data.wasTapped) { // notification in foreground
        this.popupSrv.showBasicAlert(
          data.title,
          data.body
        );
      }
    });
  }

  async getCloudMessagingToken(): Promise<string> {
    if (this.fcm.hasPermission) {
      return await this.fcm.getToken();
    }
    console.log("User Did Not Give Permission for push notifications");
  }
}
