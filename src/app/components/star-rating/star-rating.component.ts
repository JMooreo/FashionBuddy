import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.scss"]
})
export class StarRatingComponent {
  @Input() selectors = [1, 2, 3, 4, 5];
  @Output() selectedEvent = new EventEmitter<number>();
  value = 0;

  constructor() {}

  onItemSelected(value: number) {
    this.value = value;
    this.selectedEvent.emit(value);
  }
}
