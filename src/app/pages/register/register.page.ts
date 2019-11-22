import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  name = "";
  email = "";
  password = "";
  confirmPassword = "";
  rememberMe: boolean;

  constructor(
    private navCtrl: NavController,
    public authSrv: AuthService,
    private popupSrv: IonicPopupsService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("rememberMe") === "true") {
      this.email = localStorage.getItem("email");
      this.password = localStorage.getItem("password");
      this.rememberMe = true;
    }
  }

  async register() {
    await this.popupSrv.presentLoading("Authenticating...");
    const { email, password, confirmPassword } = this;

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
          this.navigateTo("tabs");
        } else {
          this.popupSrv.loadingCtrl.dismiss();
          this.popupSrv.showBasicAlert("Error", callback.message, "secondary-alert");
        }
      });

    if (this.rememberMe) {
      this.storeLocalData("true", email, password);
    } else {
      this.storeLocalData("false", "", "");
    }
  }

  storeLocalData(rememberMe: string, email: string, password: string) {
    localStorage.setItem("rememberMe", rememberMe);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateBack(`/${pageName}`);
  }
}
