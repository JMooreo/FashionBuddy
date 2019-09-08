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

    try {
      const res = await this.authSrv.signInWithEmailAndPassword(
        email,
        password
      );
      console.log(res);
      this.goToVoting();
    } catch (err) {
      console.dir(err);
      this.showAlert('Error', err.message);
    }
  }

  goToVoting() {
    this.navCtrl.navigateRoot(`/tabs`);
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
