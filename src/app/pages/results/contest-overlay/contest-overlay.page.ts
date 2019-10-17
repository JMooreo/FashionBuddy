import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams, ToastController } from "@ionic/angular";
import { Contest, ContestOption } from "src/app/models/contest-model";
import { ContestWinnerPage } from "../contest-winner/contest-winner.page";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "app-contest-overlay",
  templateUrl: "./contest-overlay.page.html",
  styleUrls: ["./contest-overlay.page.scss"],
  animations: [
    trigger("fadeInAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s ease-in", style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ContestOverlayPage implements OnInit {
  userHasNotSeenWinnerYet: boolean;
  loadContestInfoAndFeedbackForm = false;
  percentages: Array<number> = [];
  textColors = ["#FF8F00", "#4C46FD"];
  borderColors = [
    "linear-gradient(#FF8F00,#FFB800)",
    "linear-gradient(#4C46FD, #B074C2)",
    "linear-gradient(#219673, #83BE01)"
  ];

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
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.pageLoad();
    // .then(loaded => {
    //   if (this.userHasNotSeenWinnerYet) {
    //     this.openOutfitWinnerScreen();
    //   }
    // });
  }

  ionViewDidEnter() {
    this.loadContestInfoAndFeedbackForm = true;
  }

  async pageLoad() {
    this.contest = await this.navParams.get("contest");
    // this.userHasNotSeenWinnerYet = await this.navParams.get("showWinner");
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

  onFeedbackSubmitted(event: any) {
    const rating = event.formData.rating;
    if (rating !== null && rating < 3) {
      this.showToast("Sorry", "We hope next time goes better :)");
    } else {
      this.showToast("Awesome!", "Thanks for the feedback :)");
    }
    alert(event.message);
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

  async showToast(header: string, message: string) {
    const toast = await this.toastCtrl.create({
      header,
      message,
      color: "light",
      duration: 1500,
      position: "bottom"
    });
    toast.present();
  }
}
