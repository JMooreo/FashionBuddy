import { Component, OnInit, Input } from "@angular/core";
import { Contest } from "src/app/models/contest-model";

@Component({
  selector: "app-contest-info",
  templateUrl: "./contest-info.component.html",
  styleUrls: ["./contest-info.component.scss"]
})
export class ContestInfoComponent implements OnInit {
  @Input() contestData: Contest;

  constructor() {}

  ngOnInit() {}

  getContestDuration() {
    const startDate = new Date(this.contestData.createDateTime);
    const endDate = new Date(this.contestData.closeDateTime);
    const duration = new Date(endDate.getTime() - startDate.getTime() + 18000000);

    const hours = duration.getHours();
    const minutes = duration.getMinutes();

    return this.getFormattedTimeLabel(hours, minutes);
  }

  getFormattedTimeLabel(hours: number, minutes: number) {
    let formattedLabel = "";

    if (hours > 0) {
      formattedLabel += `${hours} hr `;
    }

    if (!(hours > 0 && minutes === 0)) {
      formattedLabel += `${minutes} min`;
    }

    return formattedLabel;
  }
}
