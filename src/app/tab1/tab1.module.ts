import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TinderCardComponent } from '../components/tinder-card/tinder-card.component';

@NgModule({
  imports: [
    DragDropModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page, TinderCardComponent]
})
export class Tab1PageModule {}
