import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { Contest } from '../../models/contest-model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  // Constants
  ANIMATION_DELAY = 600;
  // Booleans
  isContestVisible = false; // default invisible for fade in
  isRefreshing = false;
  // Objects
  contests: Array<Contest>;

  constructor(private dbSrv: DatabaseService) {}

  ngOnInit() {
    this.pageLoad();
  }

  async doRefresh(event) {
    this.isRefreshing = true;
    this.isContestVisible = false;
    await this.pageLoad();
    await event.target.complete();
    this.isRefreshing = false;
  }

  async pageLoad() {
    this.isContestVisible = false;
    this.contests = await this.dbSrv.getAllContestsForUser();
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
