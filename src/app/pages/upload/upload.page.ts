import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss']
})
export class UploadPage implements OnInit {
  constructor(private dbSrv: DatabaseService) {}

  ngOnInit() {
    this.pageLoad();
  }

  pageLoad() {
    this.createContest();
  }

  createContest() {
    const testContestOptions = [
      { imageUrl: 'https://via.placeholder.com/1080x1920?text=Option_1', votes: 0 },
      { imageUrl: 'https://via.placeholder.com/1080x1920?text=Option_2', votes: 0 }
    ];
    const testCreateDateTime = new Date(Date.now());
    const testCloseDateTime = new Date('2020');

    const contest = {
      createDateTime: testCreateDateTime.toISOString(),
      closeDateTime: testCloseDateTime.toISOString(),
      occasion: 'testContest description',
      reportCount: 0,
      style: 'test Style'
    };
    this.dbSrv.createContest(contest, testContestOptions);
  }
}
