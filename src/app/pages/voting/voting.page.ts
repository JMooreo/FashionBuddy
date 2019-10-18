import { Component } from "@angular/core";
import { DatabaseService } from "../../services/database/database.service";
import { Contest } from "../../models/contest-model";
import { trigger, style, animate, transition } from "@angular/animations";
import { NavController } from "@ionic/angular";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

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
export class VotingPage {
  animationDelay = 100;
  isContestVisible = false;
  isFirstPageLoad = true;
  contests: Array<Contest>;

  constructor(
    private dbSrv: DatabaseService,
    private popupSrv: IonicPopupsService,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter() {
    this.pageLoad();
    if (this.isFirstPageLoad) {
      this.popupSrv.loadingCtrl.dismiss();
      this.isFirstPageLoad = false;
    }
  }

  async pageLoad() {
    this.setContestVisibility(false);
    this.contests = await this.dbSrv.getAllContestsUserHasNotSeenOrVotedOn();
    this.setContestVisibility(true);
  }

  async doRefresh(event) {
    await this.pageLoad();
    await event.target.complete();
  }

  setContestVisibility(visibility: boolean) {
    this.isContestVisible = visibility;
  }

  hideContest() {
    this.setContestVisibility(false);
    setTimeout(() => {
      this.contests.shift();
      this.setContestVisibility(true);
    }, this.animationDelay);
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
    this.navCtrl.navigateForward(`/${pageName}`);
  }

  async confirmReport(contestId: string) {
    const alert = await this.popupSrv.alertCtrl.create({
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
      ],
      mode: "ios"
    });
    return alert.present();
  }

  reportContest(contestId: string) {
    this.hideContest();
    this.popupSrv.showBasicAlert(
      "Success",
      "Thanks for your help! We won't show that post anymore."
    );
    this.dbSrv.reportContest(contestId);
  }
}
