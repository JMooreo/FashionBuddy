import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Contest, ContestOption } from "src/app/models/contest-model";
import { Chart } from "chart.js";

@Component({
  selector: "app-contest-overlay",
  templateUrl: "./contest-overlay.page.html",
  styleUrls: ["./contest-overlay.page.scss"]
})
export class ContestOverlayPage implements OnInit {
  contestOptions = [
    { id: "null", imageUrl: "null", votes: 0 } as ContestOption
  ];

  contest: Contest = {
    options: this.contestOptions,
    contestOwner: "null",
    createDateTime: "null",
    closeDateTime: "null",
    occasion: "null",
    reportCount: 0,
    style: "null"
  };

  percentages: Array<number> = [];
  BarChart = null;

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
    this.createBarChart();
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

  createBarChart() {
    let i = 1;
    const labels = [];
    const votesArray = [];
    this.contest.options.forEach(option => {
      labels.push(`Outfit ${i}`);
      votesArray.push(option.votes);
      i++;
    });
    this.BarChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "# of Votes",
            data: votesArray,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          text: "Total Votes",
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
