import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;

  constructor(private afAuth: AngularFireAuth) {
    this.user = this.afAuth.auth.currentUser;
  }

  getUserId() {
    return 'temporaryUserID';
    // this.user.uid;
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}
