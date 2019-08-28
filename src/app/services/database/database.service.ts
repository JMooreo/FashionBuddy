import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest-model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  userId = this.authSrv.getUserId();
  contestsRef = firebase.firestore().collection('Contests');

  constructor(
    private firestore: AngularFirestore,
    private authSrv: AuthService
  ) {}

  async getAllContestsForUser() {
    const rightNow = new Date(Date.now());
    const contests = new Array<Contest>();
    await this.contestsRef
      .where('closeDateTime', '>', rightNow.toISOString()) // contest open
      // .where('any query that I want')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(contest => {
          this.contestsRef.doc(contest.id).collection('Voters').doc(this.userId).get()
            .then(voter => {
              if (!voter.exists) { // this user did not vote on contest
                contests.push(contest.data() as Contest);
              } else {
                // console.log(voter.data());
              }
            });
        });
      });
    return contests;
  }

  createContest(contest: Contest) {
    this.firestore.collection('Contests').add(contest);
  }

  updateUsersSeen(contest: Contest) {
    this.firestore.doc('Contests/' + contest.id).update({
      usersSeen: firebase.firestore.FieldValue.arrayUnion(this.userId)
    });
  }
}
