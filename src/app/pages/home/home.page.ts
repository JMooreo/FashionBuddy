import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contests/contest.service';
import { Contest } from '../../models/contest-model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  isContestVisible = false; // default invisible for fade in
  ANIMATION_DELAY = 500;
  contests: any;
  constructor(private ContestSrv: ContestService) {}

  ngOnInit() {
    this.pageLoad();
  }

  async pageLoad() {
    this.contests = await this.subscribeToContests();
    setTimeout(() => {
      this.isContestVisible = true;
    }, this.ANIMATION_DELAY);
  }

  subscribeToContests() {
    this.ContestSrv.getAllContests().subscribe(res => {
      const contests = res.map(item => {
        return {
          ...item.payload.doc.data(),
          id: item.payload.doc.id,
        } as Contest;
      });
      this.contests = contests;
    });
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
