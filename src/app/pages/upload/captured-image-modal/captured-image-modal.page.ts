import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { ImageCropperComponent, ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "app-captured-image-modal",
  templateUrl: "./captured-image-modal.page.html",
  styleUrls: ["./captured-image-modal.page.scss"]
})
export class CapturedImageModalPage implements OnInit {
  @ViewChild(ImageCropperComponent, null) imageCropper: ImageCropperComponent;

  image = null;
  showCropper = false;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.image = this.navParams.get("base64Image");
  }

  imageLoaded() {
    this.showCropper = true;
  }

  crop() {
    this.imageCropper.crop();
  }

  save(event: ImageCroppedEvent) {
    this.modalCtrl.dismiss({ croppedImage: event.base64 });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
