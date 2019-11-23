import { Injectable } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController
} from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class IonicPopupsService {
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  ) {}

  async showBasicAlert(header: string, message: string, cssClass = "primary") {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [{ text: "OK", cssClass }],
      mode: "ios"
    });
    return alert.present();
  }

  async presentLoading(message: string, spinner: any = "crescent") {
    const loading = await this.loadingCtrl.create({
      spinner,
      message,
      mode: "ios"
    });
    return loading.present();
  }

  async makeToast(header: string, message: string, position: any = "top") {
    const toast = await this.toastCtrl.create({
      header,
      message,
      position,
      mode: "ios",
      buttons: [
        {
          text: "Close",
          role: "cancel",
        }
      ]
    });
    return toast.present();
  }
}
