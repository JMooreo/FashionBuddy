import { Component, OnInit } from "@angular/core";
import { NavController, AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  email = "";
  password = "";

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    const { email, password } = this;
    await this.presentLoading();
    this.authSrv.signInWithEmailAndPassword(email, password).then(callback => {
      if (callback === true) {
        this.navigateTo("tabs");
      } else {
        this.loadingCtrl.dismiss();
        this.showAlert("Error", callback.message);
      }
    });
  }

  async navigateTo(pageName: string) {
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
