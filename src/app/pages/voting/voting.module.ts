import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VotingPage } from './voting.page';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TinderCardComponent } from '../../components/tinder-card/tinder-card.component';

@NgModule({
  imports: [
    DragDropModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VotingPage }])
  ],
  declarations: [VotingPage, TinderCardComponent]
})
export class VotingPageModule {}
