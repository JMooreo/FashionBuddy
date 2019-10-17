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

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
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
                this.showAlert(
                  "Sorry to see you go",
                  "We successfully deleted your account"
                );
                this.navigateTo("register");
              })
              .catch(err => this.showAlert("Error", err.message));
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });

    return alert.present();
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateBack(`/${pageName}`);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    return alert.present();
  }
}
