import { Injectable } from "@angular/core";
import { Contest, ContestOption } from "../../models/contest-model";
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
    await this.contestsRef
      .where("closeDateTime", ">", rightNow.toISOString())
      // .limit(number) if necessary to reduce data download
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(contest => {
          this.contestsRef
            .doc(contest.id)
            .collection("Voters")
            .doc(this.authSrv.getUserId())
            .get()
            .then(voter => {
              if (!voter.exists) {
                // this user did not vote on contest
                const contestOptions = new Array<ContestOption>();
                this.contestsRef
                  .doc(contest.id)
                  .collection("Options")
                  .get()
                  .then(options => {
                    options.forEach(option => {
                      contestOptions.push({
                        ...option.data(),
                        id: option.id
                      } as ContestOption);
                    });
                  });
                contests.push({
                  ...contest.data(),
                  options: contestOptions,
                  id: contest.id
                } as Contest);
              }
            });
        });
      });
    return contests;
  }

  async getAllContestsWhereUserIsContestOwner(startAt: number = 0) {
    const contests = new Array<Contest>();
    await this.contestsRef
      .where("contestOwner", "==", this.authSrv.getUserId())
      .limit(10) // reduce data download
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(contest => {
          const contestOptions = new Array<ContestOption>();
          this.contestsRef
            .doc(contest.id)
            .collection("Options")
            .orderBy("votes", "desc")
            .get()
            .then(options => {
              options.forEach(option => {
                contestOptions.push({
                  ...option.data(),
                  id: option.id
                } as ContestOption);
              });
            });
          contests.push({
            ...contest.data(),
            options: contestOptions,
            id: contest.id
          } as Contest);
        });
      });
    return contests;
  }
  createContest(
    contestId: string,
    contest: Contest,
    options: Array<ContestOption>
  ): Promise<any> {
    return this.contestsRef
      .doc(contestId)
      .set({ ...contest })
      .then(() => {
        this.setContestOptions(contestId, options);
        this.setContestOwner(contestId);
      });
  }

  addContestVote(contestId: string, option: ContestOption) {
    this.addVoterToContestSubcollection(contestId, option);
    this.incrementOptionVoteCount(1, contestId, option);
  }

  setContestOptions(contestId: string, options: Array<ContestOption>) {
    let i = 1;
    options.forEach(option => {
      this.contestsRef
        .doc(contestId)
        .collection("Options")
        .doc(`option_${i}`)
        .set({ ...option });
      i++;
    });
  }

  setContestOwner(contestId: string) {
    this.contestsRef
      .doc(contestId)
      .collection("Voters")
      .doc(this.authSrv.getUserId())
      .set({
        isContestOwner: true
      });
  }

  addVoterToContestSubcollection(contestId: string, option: ContestOption) {
    this.contestsRef
      .doc(contestId)
      .collection("Voters")
      .doc(this.authSrv.getUserId())
      .set({
        contestOwner: false,
        votedFor: option.id,
        timestamp: new Date(Date.now()).toISOString()
      });
  }

  incrementOptionVoteCount(
    incrementAmount: number,
    contestId: string,
    option: ContestOption
  ) {
    this.contestsRef
      .doc(contestId)
      .collection("Options")
      .doc(option.id)
      .update({
        votes: firebase.firestore.FieldValue.increment(incrementAmount)
      });
  }
}
