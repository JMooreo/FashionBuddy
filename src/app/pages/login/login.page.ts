import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

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
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    const { email, password } = this;

    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(
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
