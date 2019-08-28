import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;

  constructor(
    public afAuth: AngularFireAuth) {
    this.user = this.afAuth.auth.currentUser;
  }

  getUserName() {
    return 'FirstName LastName';
    // this.user.displayName;
  }

  getUserId() {
    return 'temporaryUserId';
    // this.user.uid;
  }
}
