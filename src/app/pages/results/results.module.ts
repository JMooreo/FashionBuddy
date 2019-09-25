import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultsPage } from '../results/results.page';
import { SharedComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    RouterModule.forChild([{ path: '', component: ResultsPage }])
  ],
  declarations: [ResultsPage]
})
export class ResultsPageModule {}
