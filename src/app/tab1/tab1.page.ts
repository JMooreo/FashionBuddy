import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  contest = {
    id: 'testId',
    createDateTime: '2019-01-01T12:00:00:000Z',
    closeDateTime: '2019-01-01T13:00:00:000Z',
    description: 'going out',
    style: 'casual',
    options: [
      {
        id: 1,
        imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_1',
        votes: 2
      },
      {
        id: 2,
        imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_2',
        votes: 6
      }
    ]
  };
  constructor() {}
}
