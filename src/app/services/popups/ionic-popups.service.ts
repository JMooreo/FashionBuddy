import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class IonicPopupsService {
  constructor(public alertCtrl: AlertController) {}

  async showBasicAlert(header: string, message: string, buttons = ["OK"]) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons
      });
      return alert.present();
  }
}
