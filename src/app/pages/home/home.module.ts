import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TinderCardComponent } from '../../components/tinder-card/tinder-card.component';

@NgModule({
  imports: [
    DragDropModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage, TinderCardComponent]
})
export class HomePageModule {}
