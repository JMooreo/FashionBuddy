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
  email = "";
  password = "";
  confirmPassword = "";
  rememberMe: boolean;

  constructor(
    private navCtrl: NavController,
    public authSrv: AuthService,
    private popupSrv: IonicPopupsService,
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

    if (password !== confirmPassword) {
      this.popupSrv.loadingCtrl.dismiss();
      this.popupSrv.showBasicAlert("Error", "Passwords do not match");
      return;
    }

    await this.authSrv
      .createUserWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.navigateTo("tabs");
        } else {
          this.popupSrv.loadingCtrl.dismiss();
          this.popupSrv.showBasicAlert("Error", callback.message);
        }
      });

    if (this.rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.setItem("rememberMe", "false");
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
    }
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateBack(`/${pageName}`);
  }
}
