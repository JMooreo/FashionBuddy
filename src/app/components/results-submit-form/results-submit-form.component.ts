import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-results-submit-form",
  templateUrl: "./results-submit-form.component.html",
  styleUrls: ["./results-submit-form.component.scss"]
})
export class ResultsSubmitFormComponent {
  @Output() formSubmitted = new EventEmitter<any>();
  userDidWearOutfit: boolean = null;
  winningOutfitRating: number = null;

  constructor() {}

  onItemSelect(event: string) {
    this.userDidWearOutfit = event === "Yes" ? true : false;
  }

  onStarSelect(event: number) {
    this.winningOutfitRating = event;
  }

  submitForm() {
    this.formSubmitted.emit({
      formData: {
        woreOutfit: this.userDidWearOutfit,
        rating: this.winningOutfitRating
      }
    });
  }
}
