import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private authSrv: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async logOut() {
    const alert = await this.alertCtrl.create({
      header: "Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.authSrv.logOut().then(() => {
              this.navigateTo("login");
            });
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });

    return alert.present();
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateRoot(`/${pageName}`);
  }
}
