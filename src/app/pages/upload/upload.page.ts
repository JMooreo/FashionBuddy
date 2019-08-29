import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';
import { ContestOption } from 'src/app/models/contest-model';

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

  }

  createContest() {

    const testContestOptions = [
      {id: 'option_1', imageUrl: 'test' } as ContestOption,
      {id: 'option_2', imageUrl: 'test'} as ContestOption];
    const testCreateDateTime = new Date(Date.now());
    const testCloseDateTime = new Date('2020');

    const contest = {
      id: null,
      createDateTime: testCreateDateTime.toISOString(),
      closeDateTime: testCloseDateTime.toISOString(),
      description: 'testContest description',
      reportCount: 0,
      options: testContestOptions,
      style: 'test Style'};
    this.dbSrv.createContest(contest);
  }
}
