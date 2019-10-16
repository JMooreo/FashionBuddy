import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-custom-radio-buttons",
  templateUrl: "./custom-radio-buttons.component.html",
  styleUrls: ["./custom-radio-buttons.component.scss"]
})
export class CustomRadioButtonsComponent implements OnInit {
  @Input() selectors = ["Yes", "No"];
  @Output() selectedEvent = new EventEmitter<any>();
  value = "";

  constructor() {}

  ngOnInit() {}

  onItemSelected(value: any) {
    this.value = value;
    this.selectedEvent.emit(value);
  }
}
