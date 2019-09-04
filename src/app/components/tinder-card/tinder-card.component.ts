import { Component, Input } from '@angular/core';

@Component({
  selector: 'tinder-card',
  templateUrl: './tinder-card.component.html',
  styleUrls: ['./tinder-card.component.scss']
})
export class TinderCardComponent {
  @Input() imageUrl: string;

  constructor() {}
}
