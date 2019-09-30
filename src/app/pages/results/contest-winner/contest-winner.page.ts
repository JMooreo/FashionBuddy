import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-contest-winner",
  templateUrl: "./contest-winner.page.html",
  styleUrls: ["./contest-winner.page.scss"]
})
export class ContestWinnerPage implements OnInit {
  imageUrl: string = null;

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {}

  ngOnInit() {
    this.imageUrl = this.navParams.get("imageUrl");
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
