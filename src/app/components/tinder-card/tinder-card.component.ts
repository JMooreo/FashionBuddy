import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tinder-card',
  templateUrl: './tinder-card.component.html',
  styleUrls: ['./tinder-card.component.scss'],
})
export class TinderCardComponent implements OnInit {
  @Input() ImageUrl: string;

  constructor() { }

  ngOnInit() {
    console.log('Hello Tinder Card Component');
  }

  dragEnded(event) {
    const element = event.source.getRootElement().getBoundingClientRect();
    const elementHeight = element.bottom - element.top;
    if (element.y < (-elementHeight / 4)) {
      console.log('VOTED');
      // vote()
      // animate out
    } else {
      console.log('RESET');
      // reset position
    }
  }
}
