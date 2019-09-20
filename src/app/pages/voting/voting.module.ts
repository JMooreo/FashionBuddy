import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VotingPage } from './voting.page';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    DragDropModule,
    IonicModule,
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    RouterModule.forChild([{ path: '', component: VotingPage }])
  ],
  declarations: [VotingPage]
})
export class VotingPageModule {}
