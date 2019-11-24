import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from "@angular/core";

@Component({
  selector: "tinder-card",
  templateUrl: "./tinder-card.component.html",
  styleUrls: ["./tinder-card.component.scss"]
})
export class TinderCardComponent implements OnInit {
  timeLeft: string = null;
  showOverlay = false;
  @Input() imageUrl: string;
  @Input() closeDateTime = "";
  @Output() loadedEvent = new EventEmitter<boolean>();

  constructor() {}

  emitLoaded() {
    this.loadedEvent.emit(true);
  }

  ngOnInit() {
    if (this.getTimeLeft()) {
      this.showOverlay = true;
      this.startTimer();
    }
  }

  getTimeLeft() {
    const difference = new Date(this.closeDateTime).getTime() - new Date().getTime();
    if (difference > 0) {
      const differenceInSeconds = difference / 1000;

      const hoursLeft = Math.trunc(differenceInSeconds / 3600);
      const minutesLeft = Math.trunc((differenceInSeconds / 60) % 60);
      const secondsLeft = Math.trunc(differenceInSeconds % 60);

      const hoursLabel = (hoursLeft < 10) ? `0${hoursLeft}` : hoursLeft;
      const minutesLabel = (minutesLeft < 10) ? `0${minutesLeft}` : minutesLeft;
      const secondsLabel = (secondsLeft < 10) ? `0${secondsLeft}` : secondsLeft;

      let totalTimeLeft = "";
      if (hoursLabel !== "00") {
        totalTimeLeft  += hoursLabel + ":";
      }

      totalTimeLeft += `${minutesLabel}:${secondsLabel}`;
      return totalTimeLeft;

    } else {
      this.showOverlay = false;
      return "";
    }
  }

  async startTimer() {
    if (this.showOverlay) {
      setTimeout(() => {
        this.startTimer();
        this.timeLeft = this.getTimeLeft();
      }, 1000);
    }
  }
}
