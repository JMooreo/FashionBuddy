import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database/database.service";
import { Contest } from "../../models/contest-model";
import { trigger, style, animate, transition } from "@angular/animations";
import { LoadingController, AlertController, NavController } from "@ionic/angular";

@Component({
  selector: "app-voting",
  templateUrl: "voting.page.html",
  styleUrls: ["voting.page.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s 0.3s ease-in", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("0.3s ease-out", style({ opacity: 0 }))
      ])
    ])
  ]
})
export class VotingPage implements OnInit {
  // Constants
  ANIMATION_DELAY = 100;
  // Booleans
  isContestVisible = false; // default invisible for fade in
  isRefreshing = false;
  // Objects
  contests: Array<Contest>;

  constructor(
    private dbSrv: DatabaseService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.firstPageLoad();
  }

  async firstPageLoad() {
    await this.pageLoad();
    try {
      await this.loadingCtrl.dismiss();
      this.showAlert("Success", "You're Logged in :)");
    } catch {}
  }

  async pageLoad() {
    this.setContestVisibility(false);
    this.contests = await this.dbSrv.getAllContestsUserHasNotSeenOrVotedOn();
    this.setContestVisibility(true);
  }

  async doRefresh(event) {
    this.isRefreshing = true;
    await this.pageLoad();
    await event.target.complete();
    this.isRefreshing = false;
  }

  setContestVisibility(visibility: boolean) {
    this.isContestVisible = visibility;
  }

  hideContest() {
    this.setContestVisibility(false);
    setTimeout(() => {
      this.contests.shift();
      this.setContestVisibility(true);
    }, this.ANIMATION_DELAY);
  }

  tinderCardDragEnded(event, contestId: string, optionIndex: number) {
    const element = event.source.getRootElement().getBoundingClientRect();
    const elementHeight = element.bottom - element.top;
    if (element.y < -elementHeight / 100) {
      this.hideContest();
      this.dbSrv.addContestVote(contestId, optionIndex);
    } else {
      event.source.reset();
    }
  }

  navigateTo(pageName: string) {
    this.navCtrl.navigateRoot(`/${pageName}`);
  }

  reportContest(contestId: string) {
    this.hideContest();
    this.showAlert("Report Successful", "Thanks for your help! We won't show that post anymore.");
    this.dbSrv.reportContest(contestId);
  }

  async showReportAlert(contestId: string) {
    const alert = await this.alertCtrl.create({
      header: "Confirm",
      message: "Would you like to report this post for inappropriate content?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Yes, Report",
          handler: () => {
            this.reportContest(contestId);
          }
        }
      ]
    });

    return alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });
    return alert.present();
  }
}
