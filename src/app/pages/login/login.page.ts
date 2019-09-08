import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    const { email, password } = this;
    this.authSrv.signInWithEmailAndPassword(email, password).then(callback => {
      if (callback === true) {
        this.showAlert('Success', 'You\'re Logged In!');
        this.navigateTo('tabs');
      } else {
        this.showAlert('Error', callback.message);
      }
    });
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateRoot(`/${pageName}`);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
