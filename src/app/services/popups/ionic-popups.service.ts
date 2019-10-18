import { Injectable } from "@angular/core";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class IonicPopupsService {
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
    ) {}

  async showBasicAlert(header: string, message: string, buttons = ["OK"]) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons
      });
      return alert.present();
  }

  async presentLoading(message: string, spinner: any = "crescent") {
    const loading = await this.loadingCtrl.create({
      spinner,
      message
    });
    return loading.present();
  }
}
