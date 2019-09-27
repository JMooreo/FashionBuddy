import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import { Contest } from "../../models/contest-model";
import { ModalController } from "@ionic/angular";
import { ContestOverlayPage } from "./contest-overlay/contest-overlay.page";

@Component({
  selector: "app-results",
  templateUrl: "results.page.html",
  styleUrls: ["results.page.scss"]
})
export class ResultsPage implements OnInit {
  contests = Array<Contest>();

  constructor(
    private dbSrv: DatabaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.pageLoad();
  }

  pageLoad() {
    this.dbSrv.getAllContestsWhereUserIsContestOwner().then(contests => {
      this.contests = contests;
      console.log(this.contests);
    });
  }

  async doRefresh(event) {
    this.pageLoad();
    await event.target.complete();
  }

  showOverlay(contest: Contest) {
    this.modalCtrl
      .create({
        component: ContestOverlayPage,
        componentProps: { contest }
      })
      .then(overlayPage => {
        overlayPage.present();
      });
  }
}
