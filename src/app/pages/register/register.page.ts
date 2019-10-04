import { Component, OnInit } from "@angular/core";
import { NavController, AlertController, LoadingController } from "@ionic/angular";
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

  constructor(
    private navCtrl: NavController,
    public authSrv: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async register() {
    await this.presentLoading();
    const { email, password, confirmPassword } = this;

    if (password !== confirmPassword) {
      this.showAlert("Error", "Passwords do not match");
      return console.error("Passwords do not match!");
    }
    this.authSrv
      .createUserWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.navigateTo("tabs");
        } else {
          this.loadingCtrl.dismiss();
          this.showAlert("Error", callback.message);
        }
      });
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
