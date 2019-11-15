import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  OnInit
} from "@angular/core";

@Component({
  selector: "app-duration-picker",
  templateUrl: "./duration-picker.component.html",
  styleUrls: ["./duration-picker.component.scss"]
})
export class DurationPickerComponent implements OnInit {
  @Output() timeSelectedEvent = new EventEmitter<number>();
  @ViewChild("timePicker", null) timePicker;

  timePickerLabel = "set time";
  timePickerValue = "";
  value = "5 min";
  selectors = ["5 min", "15 min", "30 min"];

  constructor() {}

  ngOnInit() {
    this.setDefaultTimeSelectorDuration();
    this.emitValueSelectedEvent(5);
  }

  onTimeSelected(value: string) {
    this.value = value;
    const cleanValue = Number(value.replace("min", "").trim());
    this.emitValueSelectedEvent(cleanValue);
  }

  parseTimePickerValue(value: string) {
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes !== 0) {
      this.timePickerLabel = this.getFormattedTimeLabel(hours, minutes);
      this.emitValueSelectedEvent(totalMinutes);
    }
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

  emitValueSelectedEvent(value: number) {
    this.timeSelectedEvent.emit(value);
  }

  async setDefaultTimeSelectorDuration() {
    const initDate = new Date();
    const value = this.timePickerValue;
    initDate.setHours(0);
    initDate.setMinutes(0);
    if (value === "") {
      this.timePickerValue = initDate.toString();
    }
  }

  openTimeSelector() {
    this.value = "custom";
    this.timePicker.open();
    this.parseTimePickerValue(this.timePickerValue);
  }
}
