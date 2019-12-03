import { Component, OnInit } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";
import { DatabaseService } from "src/app/services/database/database.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { environment } from "src/environments/environment";
import { EventLoggerService } from "src/app/event-logger.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  versionNumber = "";

  constructor(
    private popupSrv: IonicPopupsService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private dbSrv: DatabaseService,
    private appVersion: AppVersion,
    private plt: Platform,
    public logger: EventLoggerService
  ) { }

  ngOnInit() {
    if (this.plt.is("cordova")) {
      this.appVersion.getVersionNumber().then(version => {
        this.versionNumber = `${version}-${environment.production ? "Prod" : "Dev"}`;
      });
      this.logger.logButton("btn_settings", "Settings_Page");
    }
  }

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
          name: "email",
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
            this.dbSrv
              .deleteUser(data.email, data.password)
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
          handler: () => { }
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
