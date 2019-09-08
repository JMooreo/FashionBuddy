import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private navCtrl: NavController,
    public authSrv: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async register() {
    const { email, password, confirmPassword } = this;

    if (password !== confirmPassword) {
      this.showAlert('Error', 'Passwords do not match');
      return console.error('Passwords do not match!');
    }

    try {
      const res = await this.authSrv.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log(res);
      this.showAlert('Success', 'Welcome aboard!');
    } catch (err) {
      console.dir(err);
      this.showAlert('Error', err.message);
    }
  }

  goToLogin() {
    this.navCtrl.navigateRoot(`/login`);
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
