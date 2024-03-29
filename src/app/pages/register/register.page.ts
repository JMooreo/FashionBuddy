import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";
import { DatabaseService } from "src/app/services/database/database.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage {
  name = "";
  email = "";
  password = "";
  confirmPassword = "";
  rememberMe: boolean;

  constructor(
    private navCtrl: NavController,
    public authSrv: AuthService,
    private dbSrv: DatabaseService,
    private popupSrv: IonicPopupsService,
  ) {}

  async register() {
    await this.popupSrv.presentLoading("Authenticating...");
    const { name, email, password, confirmPassword } = this;

    if (this.name === "") {
      this.popupSrv.loadingCtrl.dismiss();
      this.popupSrv.showBasicAlert("Error", "Please enter your name", "secondary-alert");
      return;
    }

    if (this.name === "") {
      this.popupSrv.loadingCtrl.dismiss();
      this.popupSrv.showBasicAlert("Error", "Please enter your name", "secondary-alert");
      return;
    }

    if (password !== confirmPassword) {
      this.popupSrv.loadingCtrl.dismiss();
      this.popupSrv.showBasicAlert("Error", "Passwords do not match", "secondary-alert");
      return;
    }

    await this.authSrv
      .createUserWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.dbSrv.addUserToDatabase(name, this.authSrv.getUserId(), email);
          this.navigateTo("tabs");

          if (this.rememberMe) {
            this.storeLocalData("true", email, password);
          } else {
            this.storeLocalData("false", "", "");
          }
        } else {
          this.popupSrv.loadingCtrl.dismiss();
          this.popupSrv.showBasicAlert("Error", callback.message, "secondary-alert");
        }
      });
  }

  storeLocalData(rememberMe: string, email: string, password: string) {
    localStorage.setItem("rememberMe", rememberMe);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }

  navigateTo(pageName: string) {
    if (pageName === "tabs") {
      this.navCtrl.navigateForward(`/${pageName}`);
    } else {
      this.navCtrl.navigateBack(`/${pageName}`);
    }
  }
}
