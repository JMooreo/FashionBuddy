import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'tinder-card',
  templateUrl: './tinder-card.component.html',
  styleUrls: ['./tinder-card.component.scss'],
  animations: [
    trigger('changeState', [
      state('invisible', style({ opacity: '0' })),
      state('visible', style({ opacity: '100' })),
      transition('visible=>invisible', animate('300ms')),
      transition('invisible=>visible', animate('300ms'))
    ])
  ]
})
export class TinderCardComponent {
  @Input() imageUrl: string;
  @Input() currentState = 'invisible';

  constructor() {}

  changeState(newState: any) {
    this.currentState = newState;
  }
}
