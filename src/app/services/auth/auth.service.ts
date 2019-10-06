import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: firebase.User;

  constructor(private afAuth: AngularFireAuth) {}

  getUserId() {
    return this.afAuth.auth.currentUser.uid;
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      return true; // success callback
    } catch (err) {
      return err; // error callback
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return true; // success callback
    } catch (err) {
      return err; // error callback
    }
  }

  logOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
