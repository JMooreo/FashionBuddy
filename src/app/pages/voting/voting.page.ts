import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database/database.service";
import { Contest } from "../../models/contest-model";
import { trigger, style, animate, transition } from "@angular/animations";
import { NavController, Platform } from "@ionic/angular";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";
import { FcmService } from "src/app/services/fcm/fcm.service";

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
  animationDelay = 400;
  isContestVisible = false;
  isFirstPageLoad = true;
  contests: Contest[] = [];
  localSeenContests: string[] = [];

  constructor(
    private dbSrv: DatabaseService,
    private popupSrv: IonicPopupsService,
    private navCtrl: NavController,
    private fcmSrv: FcmService,
    private plt: Platform
  ) {}

  ngOnInit() {
    if (this.plt.is("cordova")) {
      this.dbSrv.checkAppVersion().then(data => { // Check If App Is Outdated
        if (data.isOutOfDate) {
          this.popupSrv.showBasicAlert(
            "Update",
            `Please update Fashion Buddy to the latest version (${data.latestVersion})`
          );
        }
      });
      this.fcmSrv.doNotificationSetup(); // Start Notification Listeners
    }
  }

  ionViewDidEnter() {
    this.pageLoad();
    if (this.isFirstPageLoad) {
      this.popupSrv.loadingCtrl.dismiss().catch(() => {
        console.warn(
          "Can't dismiss loading because it doesn't exist. This message is shown if you bypass the login screen"
        );
      });
      this.isFirstPageLoad = false;
    }
  }

  async pageLoad() {
    if (this.contests.length === 0) {
      this.setContestVisibility(false);
      const unSeenContestsFromDatabase = await this.dbSrv.getAllContestsUserHasNotSeenOrVotedOn();
      this.contests = unSeenContestsFromDatabase.map(contest => { // Check Local Cache Too
        if (!(this.localSeenContests.includes(contest.id))) {
          return contest;
        }
      });
      this.setContestVisibility(true);
    }
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
      this.localSeenContests.push(this.contests.shift().id); // remove from the list, add id to cache
      this.setContestVisibility(true);

      if (this.contests.length === 0) {
        this.dbSrv.updateUserFeedIsEmpty(true);
      }
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
