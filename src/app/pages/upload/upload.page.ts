import { Component } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import { ActionSheetController } from "@ionic/angular";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { CapturedImageModalPage } from "./captured-image-modal/captured-image-modal.page";
import { StorageService } from "src/app/services/storage/storage.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { trigger, style, animate, transition } from "@angular/animations";
import { IonicPopupsService } from "src/app/services/popups/ionic-popups.service";
import { FcmService } from "src/app/services/fcm/fcm.service";

@Component({
  selector: "app-upload",
  templateUrl: "upload.page.html",
  styleUrls: ["upload.page.scss"],
  animations: [
    trigger("shortFadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s ease-in", style({ opacity: 1 }))
      ])
    ]),
    trigger("mediumFadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s 0.1s ease-in", style({ opacity: 1 }))
      ])
    ]),
    trigger("longFadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("0.3s 0.2s ease-in", style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UploadPage {
  images = [null, null];
  croppedImages = [null, null];
  style = "Casual";
  occasion = "Work";
  durationInMinutes = 5;
  viewEntered = false;

  constructor(
    private dbSrv: DatabaseService,
    private storageSrv: StorageService,
    private authSrv: AuthService,
    private camera: Camera,
    private popupSrv: IonicPopupsService,
    private actionSheetCtrl: ActionSheetController,
    private fcmSrv: FcmService
  ) {}

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewDidLeave() {
    this.viewEntered = false;
  }

  async selectSource(index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
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
      ],
      mode: "ios"
    });
    await actionSheet.present();
  }

  async selectDeleteOrCrop(index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Delete this image?",
      buttons: [
        {
          text: "Remove Image",
          role: "destructive",
          handler: () => {
            this.images.splice(index, 1, null);
            this.croppedImages.splice(index, 1, null);
          }
        },
        {
          text: "Retry Crop",
          handler: () => {
            this.openCropper(this.images[index], index);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ],
      mode: "ios"
    });
    await actionSheet.present();
  }

  captureImage(sourceType: number, index: number) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 800,
      targetHeight: 1800,
      sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      dataUrl => {
        const base64Image = "data:image/jpeg;base64," + dataUrl;
        this.images[index] = base64Image;
        this.openCropper(base64Image, index);
      },
      err => {
        this.popupSrv.showBasicAlert("Unexpected Event", err);
      }
    );
  }

  openCropper(base64Image: string, index: number) {
    this.popupSrv.modalCtrl
      .create({
        component: CapturedImageModalPage,
        componentProps: { base64Image }
      })
      .then(capturedImagePage => {
        capturedImagePage.present();
        capturedImagePage.onWillDismiss().then(res => {
          if (res.data && res.data.croppedImage) {
            this.croppedImages[index] = res.data.croppedImage;
          }
        });
      });
  }

  onTimeSelectedEvent($event: number) {
    this.durationInMinutes = $event;
  }

  isFormValid() {
    for (const image of this.croppedImages) {
      if (image == null) {
        this.popupSrv.loadingCtrl.dismiss().then(() => {
          this.popupSrv.showBasicAlert(
            "Upload Failed",
            "You must choose 2 images"
          );
        });
        return false;
      }
    }

    if (this.durationInMinutes < 5) {
      this.popupSrv.loadingCtrl.dismiss().then(() => {
        this.popupSrv.showBasicAlert(
          "Upload Failed",
          "Duration must be at least 5 minutes"
        );
      });
      return false;
    }
    return true;
  }

  async uploadAllImages(contestId: string): Promise<string[]> {
    const promises = [];
    let i = 1;
    this.croppedImages.forEach(image => {
      const imageName = `${contestId}_option_${i}`;
      const uploadOneImage = this.storageSrv.uploadImage(
        image,
        imageName,
        contestId
      );
      promises.push(uploadOneImage);
      i++;
    });

    const result: string[] = await Promise.all(promises);
    return result;
  }

  async createContest() {
    await this.popupSrv.presentLoading("Uploading...");
    if (this.isFormValid()) {
      this.fcmSrv.subscribeToPostNotifications(false);
      const contestId = "cid=" + new Date(Date.now()).toISOString();
      const contestOptions = [];
      const userId = this.authSrv.getUserId();
      this.uploadAllImages(contestId).then(downloadUrls => {
        downloadUrls.forEach(url => {
          contestOptions.push({ imageUrl: url, votes: 0 });
        });

        const createDateTime = new Date(Date.now());
        const closeDateTime = new Date(createDateTime);
        closeDateTime.setMinutes(
          createDateTime.getMinutes() + this.durationInMinutes
        );

        const contest = {
          createDateTime: createDateTime.toISOString(),
          closeDateTime: closeDateTime.toISOString(),
          contestOwner: userId,
          occasion: this.occasion,
          options: contestOptions,
          reportCount: 0,
          seenUsers: [],
          style: this.style
        };

        this.dbSrv.createContest(contestId, contest).then(() => {
          this.popupSrv.loadingCtrl.dismiss().then(() => {
            this.popupSrv.showBasicAlert("Success", "Uploaded your contest!");
            this.fcmSrv.subscribeToPostNotifications(true);
          });
        });
      });
    }
  }
}
