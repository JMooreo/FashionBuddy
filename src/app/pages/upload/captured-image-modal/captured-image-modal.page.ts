import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { ImageCropperComponent, ImageCroppedEvent } from "ngx-image-cropper";
import { ImageService } from "src/app/services/image/image.service";

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
    private imageSrv: ImageService,
    private file: File
  ) {}

  ngOnInit() {
    const capturedImage = this.navParams.get("image");
    this.convertImage(capturedImage);
  }

  convertImage(path) {
    const currentName = this.imageSrv.getCurrentName(path);
    const folderPath = this.imageSrv.getFolderPath(path);

    this.file.readAsDataURL(folderPath, currentName).then(dataUrl => {
      this.image = {
        base64: dataUrl,
        filePath: path
      };
    });
  }

  imageLoaded() {
    this.showCropper = true;
  }

  crop() {
    this.imageCropper.crop();
  }

  save(event: ImageCroppedEvent) {
    const croppedImageBase64 = event.base64;
    this.modalCtrl.dismiss({ croppedImage: croppedImageBase64 });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
