import { Component } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import { Contest } from "../../models/contest-model";
import { ContestOverlayPage } from "./contest-overlay/contest-overlay.page";
import { trigger, style, animate, transition } from "@angular/animations";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";

@Component({
  selector: "app-results",
  templateUrl: "results.page.html",
  styleUrls: ["results.page.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s 0.3s ease-in", style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ResultsPage {
  contests = Array<Contest>();
  refreshEvent: any = null;

  constructor(
    private dbSrv: DatabaseService,
    private popupSrv: IonicPopupsService
  ) {}

  ionViewDidEnter() {
    this.pageLoad();
  }

  async pageLoad() {
    await this.popupSrv.presentLoading("Getting outfits...");
    this.contests = await this.dbSrv.getAllContestsWhereUserIsContestOwner();
    if (this.contests.length === 0 && this.refreshEvent) {
      this.refreshEvent.target.complete();
    }
    this.popupSrv.loadingCtrl.dismiss();
  }

  async doRefresh(event: any) {
    this.refreshEvent = await event;
    await this.pageLoad();
  }

  onCardLoaded() {
    if (this.refreshEvent != null) {
      this.refreshEvent.target.complete();
    }
  }

  showContestDetails(contest: Contest, showWinner: boolean) {
    this.popupSrv.modalCtrl
      .create({
        component: ContestOverlayPage,
        componentProps: { contest, showWinner }
      })
      .then(overlayPage => {
        overlayPage.present();
      });
  }
}
