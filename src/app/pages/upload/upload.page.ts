import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss']
})
export class UploadPage implements OnInit {
  imageUrls = ['/assets/img/Test_Image_400x900px.png', '']; // placeholder images

  constructor(
    private dbSrv: DatabaseService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.pageLoad();
  }

  pageLoad() {
    this.createContest();
  }

  showPreview(event, index) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imageUrls[index] = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async selectUploadMethod() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'How do you want to upload?',
      buttons: [
        {
          text: 'Take Picture',
          handler: () => {
            console.log('Open Camera');
          }
        },
        {
          text: 'Choose from Photos',
          handler: () => {
            console.log('Choose From Photos');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async askDeleteImage(index) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Delete Picture?',
      buttons: [
        {
          text: 'Yes, Delete',
          role: 'destructive',
          handler: () => {
            this.imageUrls.splice(index, 1, '');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  createContest() {
    const testContestOptions = [
      {
        imageUrl: 'https://via.placeholder.com/420x900?text=Option_1',
        votes: 0
      },
      {
        imageUrl: 'https://via.placeholder.com/420x900?text=Option_2',
        votes: 0
      }
    ];
    const testCreateDateTime = new Date(Date.now());
    const testCloseDateTime = new Date('2020');

    const contest = {
      createDateTime: testCreateDateTime.toISOString(),
      closeDateTime: testCloseDateTime.toISOString(),
      occasion: 'testContest occasion',
      reportCount: 0,
      style: 'test Style'
    };
    this.dbSrv.createContest(contest, testContestOptions);
  }
}
