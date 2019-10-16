import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Contest, ContestOption } from "src/app/models/contest-model";
import { ContestWinnerPage } from "../contest-winner/contest-winner.page";

@Component({
  selector: "app-contest-overlay",
  templateUrl: "./contest-overlay.page.html",
  styleUrls: ["./contest-overlay.page.scss"]
})
export class ContestOverlayPage implements OnInit {
  userHasNotSeenWinnerYet: boolean;
  percentages: Array<number> = [];
  textColors = ["#FF8F00", "#4C46FD"];
  borderColors = ["linear-gradient(#FF8F00,#FFB800)", "linear-gradient(#4C46FD, #B074C2)", "linear-gradient(#219673, #83BE01)"];

  contestOptions: Array<ContestOption> = [
    { id: "null", imageUrl: "null", votes: 0 },
    { id: "null", imageUrl: "null", votes: 0 }
  ];

  contest: Contest = {
    options: this.contestOptions,
    contestOwner: "null",
    createDateTime: "null",
    closeDateTime: "null",
    occasion: "null",
    seenUsers: [],
    reportCount: 0,
    style: "null"
  };

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.pageLoad().then(loaded => {
      if (this.userHasNotSeenWinnerYet) {
        this.openOutfitWinnerScreen();
      }
    });
  }

  async pageLoad() {
    this.contest = await this.navParams.get("contest");
    this.userHasNotSeenWinnerYet = await this.navParams.get("showWinner");
    this.calculatePercentages();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getTotalVotes() {
    let totalVotes = 0;
    this.contest.options.forEach(option => {
      totalVotes += option.votes;
    });
    return totalVotes;
  }

  calculatePercentages() {
    const totalVotes = this.getTotalVotes();
    const percentages = Array<number>();
    this.contest.options.forEach(option => {
      percentages.push(option.votes / totalVotes);
    });
    this.percentages = percentages;
  }

  async openOutfitWinnerScreen() {
    this.modalCtrl
      .create({
        component: ContestWinnerPage,
        componentProps: { imageUrl: this.contest.options[0].imageUrl }
      })
      .then(contestWinnerPage => {
        contestWinnerPage.present();
      });
  }
}
