import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { WebView } from '@ionic-native/ionic-webview/ngx';

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
    private webview: WebView
  ) {}

  ngOnInit() {
    const capturedImage = this.navParams.get("image");
    this.convertImage(capturedImage);
  }

  convertImage(path) {
    this.image = {
      path: this.webview.convertFileSrc(path),
      file: path
    };
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
