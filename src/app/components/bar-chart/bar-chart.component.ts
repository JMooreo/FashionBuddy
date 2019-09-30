import { Component, OnInit, Input } from "@angular/core";
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

  @Input() contestData: Contest = {
    options: this.contestOptions,
    contestOwner: "null",
    createDateTime: "null",
    closeDateTime: "null",
    occasion: "null",
    reportCount: 0,
    style: "null"
  };

  barChart: any;

  constructor() {}

  ngOnInit() {
    this.createBarChart();
  }

  createBarChart() {
    let i = 1;
    const labels = [];
    const votesArray = [];
    this.contestData.options.forEach(option => {
      labels.push(`Outfit ${i}`);
      votesArray.push(option.votes);
      i++;
    });
    this.barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: votesArray,
            backgroundColor: [
              "rgba(167, 60, 227, 0.2)",
              "rgba(69, 236, 214, 0.2)",
              "rgba(255, 206, 86, 0.2)"
            ],
            borderColor: [
              "rgba(167, 60, 227, 1)",
              "rgba(69, 236, 214, 1)",
              "rgba(255, 206, 86, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
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
              gridLines: {
                drawOnChartArea: false
              },
              display: false,
              ticks: {
                display: false,
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                display: false
              }
            }
          ]
        }
      }
    });
  }
}
