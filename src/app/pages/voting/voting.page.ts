import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { Contest } from '../../models/contest-model';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-voting',
  templateUrl: 'voting.page.html',
  styleUrls: ['voting.page.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class VotingPage implements OnInit {
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

  async pageLoad() {
    this.setContestVisibility(false);
    this.contests = await this.dbSrv.getAllContestsForUser();
    this.setContestVisibility(true);
  }

  async doRefresh(event) {
    this.isRefreshing = true;
    await this.pageLoad();
    await event.target.complete();
    this.isRefreshing = false;
  }

  setContestVisibility(visibility: boolean) {
    this.isContestVisible = visibility;
  }
  consoleLog() {
    console.log('hello');
  }

  hideContest() {
    this.setContestVisibility(false);
    setTimeout(() => {
      this.contests.shift();
      this.setContestVisibility(true);
    }, this.ANIMATION_DELAY);
  }

  tinderCardDragEnded(event, contestId, option) {
    const element = event.source.getRootElement().getBoundingClientRect();
    const elementHeight = element.bottom - element.top;
    if (element.y < -elementHeight / 4) {
      this.hideContest();
      this.dbSrv.addContestVote(contestId, option);
    } else {
      event.source.reset();
    }
  }
}