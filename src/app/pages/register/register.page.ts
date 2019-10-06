import { Component, OnInit } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";

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
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    try {
      if (localStorage.getItem("rememberMe") === "true") {
        this.email = localStorage.getItem("email");
        this.password = localStorage.getItem("password");
        this.rememberMe = true;
      }
    } catch {}
  }

  async register() {
    await this.presentLoading();
    const { email, password, confirmPassword } = this;

    if (password !== confirmPassword) {
      this.showAlert("Error", "Passwords do not match");
      this.loadingCtrl.dismiss();
      return;
    }

    await this.authSrv
      .createUserWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.navigateTo("tabs");
        } else {
          this.loadingCtrl.dismiss();
          this.showAlert("Error", callback.message);
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
    this.navCtrl.navigateRoot(`/${pageName}`);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "crescent",
      message: "Authenticating..."
    });
    return await loading.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
