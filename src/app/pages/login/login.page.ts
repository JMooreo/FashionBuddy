import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  email = "";
  password = "";
  rememberMe: boolean;

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private popupSrv: IonicPopupsService,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    if (localStorage.getItem("rememberMe") === "true") {
      this.email = localStorage.getItem("email");
      this.password = localStorage.getItem("password");
      this.rememberMe = true;
    }
  }

  async login() {
    const { email, password } = this;
    await this.presentLoading();
    await this.authSrv
      .signInWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.navigateTo("tabs");
        } else {
          this.loadingCtrl.dismiss();
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

  async navigateTo(pageName: string) {
    this.navCtrl.navigateForward(`/${pageName}`);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "crescent",
      message: "Authenticating..."
    });
    return await loading.present();
  }
}
