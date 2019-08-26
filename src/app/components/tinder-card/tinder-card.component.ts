import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'tinder-card',
  templateUrl: './tinder-card.component.html',
  styleUrls: ['./tinder-card.component.scss'],
  animations: [
    trigger('changeState', [
      state('invisible', style({ opacity: '0' })),
      state('visible', style({ opacity: '100' })),
      transition('*=>*', animate('300ms')),
    ])
  ]
})
export class TinderCardComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() currentState = 'visible';

  constructor() {}

  ngOnInit() {
    console.log('Hello Tinder Card Component');
  }

  changeState(newState: any) {
    this.currentState = newState;
  }
}
