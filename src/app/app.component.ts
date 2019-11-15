import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      if (this.platform.backButton) {
        this.platform.backButton.subscribe(async () => {
          if (
            (this.router.isActive(`/tabs/voting`, true) &&
              this.router.url === `/tabs/voting`) ||
            (this.router.isActive(`/login`, true) &&
              this.router.url === `/login`) ||
            (this.router.isActive(`/register`, true) &&
              this.router.url === `/register`)
          ) {
            navigator[`app`].exitApp();
          }
        });
      }
    });
  }
}
