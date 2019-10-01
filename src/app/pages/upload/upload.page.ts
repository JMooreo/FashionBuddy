import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/services/database/database.service";
import {
  ActionSheetController,
  ModalController,
  AlertController
} from "@ionic/angular";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { CapturedImageModalPage } from "./captured-image-modal/captured-image-modal.page";
import { StorageService } from "src/app/services/storage/storage.service";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-upload",
  templateUrl: "upload.page.html",
  styleUrls: ["upload.page.scss"]
})
export class UploadPage implements OnInit {
  images = [null, null];
  croppedImages = [null, null];
  style: string = null;
  occasion: string = null;
  durationInMinutes: number = null;
  storeCode: string = null;

  constructor(
    private dbSrv: DatabaseService,
    private storageSrv: StorageService,
    private authSrv: AuthService,
    private camera: Camera,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {}

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
      ]
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
      ]
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
        alert("Failed to capture image");
      }
    );
  }

  openCropper(base64Image: string, index: number) {
    this.modalCtrl
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

  onTimeSelectedEvent($event) {
    console.log("duration", $event);
  }

  isFormValid() {
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

  createContest() {
    if (this.validateFormData()) {
      const contestId = "cid=" + new Date(Date.now()).toISOString();
      const contestOptions = [];
      const userId = this.authSrv.getUserId();
      this.uploadAllImages(contestId).then(downloadUrls => {
        downloadUrls.forEach(url => {
          contestOptions.push({ imageUrl: url, votes: 0 });
        });

        const testCreateDateTime = new Date(Date.now());
        const testCloseDateTime = new Date("2020");

        const contest = {
          createDateTime: testCreateDateTime.toISOString(),
          closeDateTime: testCloseDateTime.toISOString(),
          contestOwner: userId,
          occasion: "testContest occasion",
          reportCount: 0,
          style: "test Style"
        };

        this.dbSrv
          .createContest(contestId, contest, contestOptions)
          .then(() => {
            this.showAlert("Success", "Uploaded your contest!");
          });
      });
    }
  }

  validateFormData() {
    // must have 2 photos
    for (const image of this.croppedImages) {
      if (image == null) {
        alert("must upload 2 images!");
        return false;
      }
    }
    return true;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
