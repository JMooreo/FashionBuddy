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
  @Output() timeSelectedEvent = new EventEmitter<string>();
  @ViewChild("timePicker", null) timePicker;

  timePickerLabel = "set time";
  timePickerValue = "";
  value = "5 min";
  selectors = ["5 min", "15 min", "30 min"];

  constructor() {}

  ngOnInit() {
    const initDate = new Date();
    initDate.setHours(0);
    initDate.setMinutes(10);
    this.timePickerValue = initDate.toString();
  }

  onTimeSelected(value: string) {
    this.value = value;
    const cleanValue = value.replace("min", "").trim();
    this.emitValueSelectedEvent(cleanValue);
  }

  parseTimePickerValue(value: string) {
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    this.timePickerLabel = this.getFormattedTimeLabel(hours, minutes);
    this.emitValueSelectedEvent(totalMinutes.toString());
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

  emitValueSelectedEvent(value: string) {
    this.timeSelectedEvent.emit(value);
  }

  openTimeSelector() {
    this.value = "custom";
    this.timePicker.open();
    this.parseTimePickerValue(this.timePickerValue);
  }
}
