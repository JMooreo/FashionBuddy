import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import { Contest } from "../../models/contest-model";
import { ModalController, LoadingController } from "@ionic/angular";
import { ContestOverlayPage } from "./contest-overlay/contest-overlay.page";

@Component({
  selector: "app-results",
  templateUrl: "results.page.html",
  styleUrls: ["results.page.scss"]
})
export class ResultsPage implements OnInit {
  contests = Array<Contest>();
  refreshEvent: any;
  loading = false;

  constructor(
    private dbSrv: DatabaseService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.firstPageLoad();
  }

  async firstPageLoad() {
    await this.presentLoading();
    await this.pageLoad();
    if (this.contests.length === 0) {
      this.loadingCtrl.dismiss();
      this.loading = false;
    }
  }

  async pageLoad() {
    this.dbSrv.getAllContestsWhereUserIsContestOwner().then(contests => {
      this.contests = contests;
      console.log(this.contests);
      if (this.contests.length === 0 && this.refreshEvent) {
        this.refreshEvent.target.complete();
      }
    });
  }

  async doRefresh(event) {
    await this.pageLoad();
    this.refreshEvent = event;
  }

  onCardLoaded() {
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
    }
    if (this.loading) {
      this.loadingCtrl.dismiss();
      this.loading = false;
  }
}

  showContestDetails(contest: Contest, showWinner: boolean) {
    this.modalCtrl
      .create({
        component: ContestOverlayPage,
        componentProps: { contest, showWinner }
      })
      .then(overlayPage => {
        overlayPage.present();
      });
  }

  async presentLoading() {
    this.loading = true;
    const loading = await this.loadingCtrl.create({
      spinner: "crescent",
      message: "Getting outfits..."
    });
    return await loading.present();
  }
}
