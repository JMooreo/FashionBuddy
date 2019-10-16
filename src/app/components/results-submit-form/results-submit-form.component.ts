import { Component, Output, EventEmitter } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-results-submit-form",
  templateUrl: "./results-submit-form.component.html",
  styleUrls: ["./results-submit-form.component.scss"]
})
export class ResultsSubmitFormComponent {
  @Output() formSubmitted = new EventEmitter<any>();
  userDidWearOutfit: boolean = null;
  winningOutfitRating: number = null;

  constructor(private loadingCtrl: LoadingController) {}

  onItemSelect(event: string) {
    this.userDidWearOutfit = event === "Yes" ? true : false;
  }

  onStarSelect(event: number) {
    this.winningOutfitRating = event;
  }

  submitForm() {
    this.presentLoading();
    setTimeout(() => { // this.dbSrv.storeinDatabase().then(() => {
      this.loadingCtrl.dismiss();
      this.formSubmitted.emit({
        message: "Form submission not implemented yet",
        formData: {
          woreOutfit: this.userDidWearOutfit,
          rating: this.winningOutfitRating
        }
      });
    }, 2000);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "crescent",
      message: "Uploading..."
    });
    return await loading.present();
  }
}
