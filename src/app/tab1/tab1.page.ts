import { Component, OnInit } from '@angular/core';
import { ContestService } from '../services/contests/contest.service';
import { Contest } from '../models/contest-model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  isContestVisible = false; // default invisible for fade in
  ANIMATION_DELAY = 500;
  contests: any;
  constructor(private contestSrv: ContestService) {}

  ngOnInit() {
    this.pageLoad();
  }

  async pageLoad() {
    // await contests, then short timeout for fade in
    this.contests = await this.contestSrv.getAllContests();
    setTimeout(() => {
      this.isContestVisible = true;
    }, this.ANIMATION_DELAY);
  }

  hideContest() {
    this.isContestVisible = false;
    setTimeout(() => {
      this.contests.shift();
      setTimeout(() => {
        this.isContestVisible = true;
      }, this.ANIMATION_DELAY / 2);
    }, this.ANIMATION_DELAY); // tinder fade-out default 300ms
  }

  tinderCardDragEnded(event) {
    const element = event.source.getRootElement().getBoundingClientRect();
    const elementHeight = element.bottom - element.top;
    if (element.y < -elementHeight / 4) {
      this.hideContest();
    } else {
      event.source.reset();
    }
  }
}
