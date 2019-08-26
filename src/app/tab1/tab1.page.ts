import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isContestVoted = false;

  contests = [
    {
      id: 'contest1',
      isVoted: false,
      createDateTime: '2019-01-01T12:00:00:000Z',
      closeDateTime: '2019-01-01T13:00:00:000Z',
      description: 'going out',
      style: 'casual',
      options: [
        {
          id: '1',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_1',
          votes: 2
        },
        {
          id: '2',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_2',
          votes: 6
        }
      ]
    },
    {
      id: 'contest2',
      isVoted: false,
      createDateTime: '2019-01-01T12:00:00:000Z',
      closeDateTime: '2019-01-01T13:00:00:000Z',
      description: 'going out',
      style: 'casual',
      options: [
        {
          id: '1',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_3',
          votes: 3
        },
        {
          id: '2',
          imageUrl: 'https://via.placeholder.com/1080x1920?text=Image_4',
          votes: 5
        }
      ]
    }
  ];
  constructor() {}

  closeContest() {
    this.isContestVoted = true;
    setTimeout(() => {
      this.contests.shift();
      setTimeout(() => {
        this.isContestVoted = false;
      }, 300);
    }, 500); // tinder fade-out default 300ms
  }

  tinderCardDragEnded(event) {
    const element = event.source.getRootElement().getBoundingClientRect();
    const elementHeight = element.bottom - element.top;
    if (element.y < -elementHeight / 4) {
      this.closeContest();
    } else {
      event.source.reset();
    }
  }
}
