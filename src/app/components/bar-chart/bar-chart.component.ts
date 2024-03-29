import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { Contest, ContestOption } from "src/app/models/contest-model";
import * as Chart from "chart.js";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"]
})
export class BarChartComponent implements OnInit {
  contestOptions = [
    { id: "null", imageUrl: "null", votes: 0 } as ContestOption
  ];
  @ViewChild("barChart", { static: false }) barChart;
  @Output() loadedEmitter = new EventEmitter<boolean>();
  @Input() height = "125";

  @Input() contestData: Contest = {
    options: this.contestOptions,
    contestOwner: "null",
    createDateTime: "null",
    closeDateTime: "null",
    occasion: "null",
    reportCount: 0,
    seenUsers: [],
    style: "null"
  };

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.createBarChart();
    }, 300);
  }

  createBarChart() {
    let i = 1;
    const labels = [];
    const votesArray = [];
    let noVotes = true;
    this.contestData.options.forEach(option => {
      labels.push(`Outfit ${i}`);
      votesArray.push(option.votes);
      if (option.votes > 0) {
        noVotes = false;
      }
      i++;
    });

    const ctx = (this.barChart.nativeElement as HTMLCanvasElement).getContext("2d");

    const orangeGradient = ctx.createLinearGradient(0, 0, 0, 150);
    orangeGradient.addColorStop(0, "#FFB800");
    orangeGradient.addColorStop(1, "#FF8F00");

    const blueGradient = ctx.createLinearGradient(0, 0, 0, 150);
    blueGradient.addColorStop(0, "#C074C2");
    blueGradient.addColorStop(0.7, "#4C46FD");

    this.barChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: noVotes ? [1, 1] : votesArray.reverse(),
            backgroundColor: [blueGradient, orangeGradient],
            borderWidth: 1
          }
        ]
      },
      options: {
        animation: {
          duration: 800,
          animateRotate: true,
          onComplete: () => this.loadedEmitter.emit(true),
        },
        tooltips: {
          enabled: true
        },
        title: {
          text: "Total Votes",
          display: false
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: false
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        }
      }
    });
  }
}
