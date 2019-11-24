import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";
import { DatabaseService } from "src/app/services/database/database.service";

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
    private dbSrv: DatabaseService,
    private popupSrv: IonicPopupsService,
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
    await this.popupSrv.presentLoading("Authenticating...");
    await this.authSrv
      .signInWithEmailAndPassword(email, password)
      .then(callback => {
        if (callback === true) {
          this.dbSrv.checkIfUserExistsInDatabase().then((userExists) => {
            if (userExists) {
              this.dbSrv.updateUserLastActiveDate();
            } else {
              this.popupSrv.askForName().then(name => {
                this.dbSrv.addUserToDatabase(name, this.authSrv.getUserId(), email);
              });
            }
          });
          this.navigateTo("tabs");

          if (this.rememberMe) {
            this.storeLocalData("true", email, password);
          } else {
            this.storeLocalData("false", "", "");
          }

        } else {
          this.popupSrv.loadingCtrl.dismiss();
          this.popupSrv.showBasicAlert("Error", callback.message);
        }
      });
  }

  storeLocalData(rememberMe: string, email: string, password: string) {
    localStorage.setItem("rememberMe", rememberMe);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }

  async navigateTo(pageName: string) {
    this.navCtrl.navigateForward(`/${pageName}`);
  }
}
