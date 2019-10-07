import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "tinder-card",
  templateUrl: "./tinder-card.component.html",
  styleUrls: ["./tinder-card.component.scss"]
})
export class TinderCardComponent {
  @Input() imageUrl: string;
  @Output() loadedEvent = new EventEmitter<boolean>();

  constructor() {}

  emitLoaded() {
    this.loadedEvent.emit(true);
  }
}
