import { Injectable } from "@angular/core";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics/ngx";

@Injectable({
  providedIn: "root"
})
export class EventLoggerService {

  constructor(public firebaseAnalytics: FirebaseAnalytics) {
    console.log("Hello EventLoggerProvider Provider");
  }

  logButton(name: string, screenName: string) {
    this.firebaseAnalytics.setEnabled(true);
    this.firebaseAnalytics.setCurrentScreen(screenName);
    this.firebaseAnalytics.logEvent(name, { pram: screenName });
  }
}
