import { Injectable } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";
import { IonicPopupsService } from "../popups/ionic-popups.service";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor(
    private fcm: FCM,
    private popupSrv: IonicPopupsService,
    private authSrv: AuthService
  ) {}

  doNotificationSetup() {
    this.fcm.onNotification().subscribe(data => { // Listen For Notifications
      if (!data.wasTapped) { // App Was Open
        if (data.userId !== this.authSrv.getUserId()) {
          this.popupSrv.makeToast(data.title, data.body);
        }
      }
    });
  }

  subscribeToPostNotifications(feedIsEmpty: boolean) {
    if (feedIsEmpty) { // Subscribe to post notifications
      this.fcm.subscribeToTopic("post-notifications");
    } else {
      try {
        this.fcm.unsubscribeFromTopic("post-notifications");
      } catch (err) {
        console.log("couldn't unsubscribe from post-notifications", err);
      }
    }
  }

  async getCloudMessagingToken(): Promise<string> {
    if (this.fcm.hasPermission) {
      return await this.fcm.getToken();
    }
    console.log("User Did Not Give Permission for push notifications");
  }
}
