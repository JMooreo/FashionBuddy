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
  isImageLoaded = false;
  isCropperReady = false;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.isImageLoaded = false;
    this.isCropperReady = false;
    this.image = this.navParams.get("base64Image");
  }

  imageLoaded() {
    this.isImageLoaded = true;
  }

  cropperReady() {
    this.isCropperReady = true;
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
