import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import { ActionSheetController, ModalController } from "@ionic/angular";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { CapturedImageModalPage } from "./captured-image-modal/captured-image-modal.page";

@Component({
  selector: "app-upload",
  templateUrl: "upload.page.html",
  styleUrls: ["upload.page.scss"]
})
export class UploadPage implements OnInit {
  images = [null, null];

  constructor(
    private dbSrv: DatabaseService,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  pageLoad() {
    this.createContest();
  }

  async selectSource(index) {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.captureImage(
              this.camera.PictureSourceType.PHOTOLIBRARY,
              index
            );
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.captureImage(this.camera.PictureSourceType.CAMERA, index);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  captureImage(sourceType: number, index: number) {
    const options: CameraOptions = {
      quality: 75,
      sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imagePath => {
      this.modalCtrl
        .create({
          component: CapturedImageModalPage,
          componentProps: {
            image: imagePath
          }
        })
        .then(capturedImagePage => {
          capturedImagePage.present();

          capturedImagePage.onWillDismiss().then(res => {
            if (res.data && res.data.croppedImage) {
              this.images[index] = res.data.croppedImage;
            }
          });
        });
    });
  }

  async askDeleteImage(index) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Delete Picture?",
      buttons: [
        {
          text: "Yes, Delete",
          role: "destructive",
          handler: () => {
            this.images.splice(index, 1, null);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  createContest() {
    const testContestOptions = [
      {
        imageUrl: "https://via.placeholder.com/400x900?text=Option_1",
        votes: 0
      },
      {
        imageUrl: "https://via.placeholder.com/400x900?text=Option_2",
        votes: 0
      }
    ];
    const testCreateDateTime = new Date(Date.now());
    const testCloseDateTime = new Date("2020");

    const contest = {
      createDateTime: testCreateDateTime.toISOString(),
      closeDateTime: testCloseDateTime.toISOString(),
      occasion: "testContest occasion",
      reportCount: 0,
      style: "test Style"
    };
    this.dbSrv.createContest(contest, testContestOptions);
  }
}
