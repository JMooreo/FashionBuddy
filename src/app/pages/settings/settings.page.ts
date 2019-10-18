import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage {
  constructor(
    private popupSrv: IonicPopupsService,
    private authSrv: AuthService,
    private navCtrl: NavController
  ) {}

  async logOut() {
    const alert = await this.popupSrv.alertCtrl.create({
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
      ],
      mode: "ios"
    });

    return alert.present();
  }

  async deleteAccount() {
    const alert = await this.popupSrv.alertCtrl.create({
      header: "Log in to delete",
      message: "Enter email and password to delete account",
      inputs: [
        {
          name: "Email",
          placeholder: "Email"
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password"
        }
      ],
      buttons: [
        {
          text: "Done",
          handler: data => {
            this.authSrv
              .deleteUser(data.Email, data.password)
              .then(() => {
                this.popupSrv.showBasicAlert(
                  "Sorry to see you go",
                  "We successfully deleted your account"
                );
                this.navigateTo("register");
              })
              .catch(err => this.popupSrv.showBasicAlert("Error", err.message));
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ],
      mode: "ios"
    });

    return alert.present();
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateBack(`/${pageName}`);
  }
}
