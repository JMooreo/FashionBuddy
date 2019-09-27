import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Contest } from "src/app/models/contest-model";

@Component({
  selector: "app-contest-overlay",
  templateUrl: "./contest-overlay.page.html",
  styleUrls: ["./contest-overlay.page.scss"]
})
export class ContestOverlayPage implements OnInit {

  contest: Contest = null;
  percentages: Array<number> = [];
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.pageLoad();
  }

  async pageLoad() {
    this.contest = await this.navParams.get("contest");
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
}
