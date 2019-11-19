import { Injectable } from "@angular/core";
import { Contest } from "../../models/contest-model";
import { UserDocument } from "../../models/user-document";
import { AuthService } from "../auth/auth.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { environment } from "src/environments/environment";
firebase.initializeApp(environment.firebaseConfig);

import { FcmService } from "../fcm/fcm.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  contestsRef = firebase.firestore().collection("Contests");
  usersRef = firebase.firestore().collection("Users");
  devicesRef = firebase.firestore().collection("Devices");
  contestFeedbackRef = firebase.firestore().collection("ContestFeedback");
  logisticsRef = firebase.firestore().collection("Logistics");

  constructor(private authSrv: AuthService, private fcmSrv: FcmService, private appVersion: AppVersion) {}

  async checkAppVersion() {
    const doc = await this.logisticsRef.doc("version").get();
    const currentVersion = await this.appVersion.getVersionNumber();
    return {
      latestVersion: doc.data().latestVersion,
      isOutOfDate: currentVersion < doc.data().latestVersion
    };
  }

  async getAllContestsUserHasNotSeenOrVotedOn() {
    const rightNow = new Date(Date.now());
    const contests = new Array<Contest>();
    let filteredContests = Array<Contest>();
    const userId = this.authSrv.getUserId();
    await this.contestsRef
      .where("closeDateTime", ">", rightNow.toISOString())
      .orderBy("closeDateTime", "asc")
      // .limit(number) if necessary to reduce data download
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(contest => {
          contests.push({
            ...contest.data(),
            id: contest.id
          } as Contest);
        });
      })
      .then(() => {
        filteredContests = contests.filter(contest => {
          // user has not seen the contest before && is not contest owner
          return (
            contest.seenUsers.indexOf(userId) === -1 &&
            contest.contestOwner !== userId
          );
        });
      });
    this.updateUserFeedIsEmpty(filteredContests.length === 0);
    return filteredContests;
  }

  async getAllContestsWhereUserIsContestOwner(startAt: number = 0) {
    const contests = new Array<Contest>();
    let filteredContests = Array<Contest>();
    await this.contestsRef
      .where("contestOwner", "==", this.authSrv.getUserId())
      .orderBy("createDateTime", "desc")
      .limit(10) // reduce data download
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(contest => {
          contests.push({
            ...contest.data(),
            id: contest.id
          } as Contest);
        });
      })
      .then(() => {
        filteredContests = contests.map(contest => {
          // sort descending by # of votes
          contest.options.sort((a, b) => {
            return b.votes - a.votes;
          });
          return contest;
        });
      });
    return filteredContests;
  }

  async addUserToDatabase(firstName: string, userId: string, email: string) {
    const rightNow = new Date();

    const userDoc: UserDocument = {
      firstName,
      email,
      isFeedEmpty: false,
      signUpDate: rightNow,
      lastActive: rightNow,
      points: 0,
      status: "Fashion Buddy",
      styles: [],
      occasions: [],
      deletedAccount: false
    };

    this.usersRef.doc(userId).set({ ...userDoc });
    this.setCloudMessagingTokenOfNewDevice(userId);
  }

  async setCloudMessagingTokenOfNewDevice(userId: string) {
    const token = await this.fcmSrv.getCloudMessagingToken();
    if (token != null) {
      this.devicesRef.doc(token).set({ token, userId });
    }
  }

  updateUserFeedIsEmpty(isFeedEmpty: boolean) {
    this.usersRef.doc(this.authSrv.getUserId()).update({
      isFeedEmpty
    });
  }

  updateUserLastActiveDate() {
    this.usersRef.doc(this.authSrv.getUserId()).update({
      lastActive: new Date()
    });
  }

  createContest(contestId: string, contest: Contest): Promise<any> {
    return this.contestsRef.doc(contestId).set({ ...contest });
  }

  uploadContestFeedback(formData: any, contestId: string): Promise<any> {
    return this.contestFeedbackRef.doc(contestId).set({ ...formData });
  }

  reportContest(contestId: string) {
    this.contestsRef.doc(contestId).update({
      reportCount: firebase.firestore.FieldValue.increment(1)
    });

    this.addVoteToVotersSubcollection(contestId, "report");
  }

  addContestVote(contestId: string, optionIndex: number) {
    const optionName = `Option_${optionIndex + 1}`;
    this.addVoteToVotersSubcollection(contestId, optionName);
  }

  addVoteToVotersSubcollection(contestId: string, optionName: string) {
    this.contestsRef
      .doc(contestId)
      .collection("Voters")
      .doc(this.authSrv.getUserId())
      .set({
        votedFor: optionName,
        timestamp: new Date(Date.now()).toISOString()
      });
  }

  markUserAccountAsDeleted(userId: string) {
    this.usersRef.doc(userId).update({
      deletedAccount: true
    });
  }

  async deleteUser(email: string, password: string) {
    const userId = this.authSrv.getUserId();
    const callback = await this.authSrv.signInWithEmailAndPassword(
      email,
      password
    );
    if (callback === true) {
      this.authSrv.deleteUserFromAuth();
      this.markUserAccountAsDeleted(userId);
      return Promise.resolve("success");
    } else {
      return Promise.reject(callback);
    }
  }
}
