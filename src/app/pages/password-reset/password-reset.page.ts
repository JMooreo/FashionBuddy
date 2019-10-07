import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { AlertController, NavController } from "@ionic/angular";

@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.page.html",
  styleUrls: ["./password-reset.page.scss"]
})
export class PasswordResetPage implements OnInit {
  email = "";
  constructor(
    private authSrv: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  sendPasswordResetEmail(email: string) {
    this.authSrv.sendPasswordResetEmail(email).then(callback => {
      if (callback === true) {
        this.showAlert(
          "Success",
          `We sent an email to ${email} with a reset link`
        );
        this.navigateTo("login");
      } else {
        this.showAlert("Error", callback.message);
      }
    });
  }

  async navigateTo(pageName: string) {
    this.navCtrl.navigateRoot(`/${pageName}`);
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
