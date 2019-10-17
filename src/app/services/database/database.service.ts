import { Injectable } from "@angular/core";
import { Contest } from "../../models/contest-model";
import { AuthService } from "../auth/auth.service";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  contestsRef = firebase.firestore().collection("Contests");

  constructor(private authSrv: AuthService) {}

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
          return (contest.seenUsers.indexOf(userId) === -1 && contest.contestOwner !== userId);
        });
      });
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
      }).then(() => {
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

  createContest(contestId: string, contest: Contest): Promise<any> {
    return this.contestsRef.doc(contestId).set({ ...contest });
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
}
