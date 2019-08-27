import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest-model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getAllContests() {
    return this.firestore.collection('Contests').snapshotChanges();
  }

  createContest(contest: Contest) {
    this.firestore.collection('Contests').add(contest);
  }

}
