import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { NavController } from "@ionic/angular";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.page.html",
  styleUrls: ["./password-reset.page.scss"]
})
export class PasswordResetPage {
  email = "";
  constructor(
    private authSrv: AuthService,
    private popupSrv: IonicPopupsService,
    private navCtrl: NavController
  ) {}

  sendPasswordResetEmail(email: string) {
    this.authSrv.sendPasswordResetEmail(email).then(callback => {
      if (callback === true) {
        this.popupSrv.showBasicAlert(
          "Success",
          `We sent an email to ${email} with a reset link`
        );
        this.navigateTo("login");
      } else {
        this.popupSrv.showBasicAlert("Error", callback.message);
      }
    });
  }

  async navigateTo(pageName: string) {
    this.navCtrl.navigateBack(`/${pageName}`);
  }
}
