import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: "app-captured-image-modal",
  templateUrl: "./captured-image-modal.page.html",
  styleUrls: ["./captured-image-modal.page.scss"]
})
export class CapturedImageModalPage implements OnInit {
  image = null;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private imageSrv: ImageService,
    private webview: WebView
  ) {}

  ngOnInit() {
    this.image = this.navParams.get("image");
  }

  // convertImage(path) {
  //   return {
  //     path: this.webview.convertFileSrc(path),
  //     file: path
  //   };
  // }

  // save() {
  //   this.imageSrv.saveImage(this.image.file).then(res => {
  //     this.modalCtrl.dismiss();
  //   });
  // }

  close() {
    this.modalCtrl.dismiss();
  }
}
