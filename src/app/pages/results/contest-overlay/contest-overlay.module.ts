import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ContestOverlayPage } from "./contest-overlay.page";
import { SharedComponentsModule } from "src/app/components/components.module";
import { BarChartComponent } from "src/app/components/bar-chart/bar-chart.component";
import { ResultsSwiperComponent } from "src/app/components/results-swiper/results-swiper.component";
import { ContestInfoComponent } from "src/app/components/contest-info/contest-info.component";
import { ResultsSubmitFormComponent } from "src/app/components/results-submit-form/results-submit-form.component";
import { CustomRadioButtonsComponent } from "src/app/components/custom-radio-buttons/custom-radio-buttons.component";
import { StarRatingComponent } from "src/app/components/star-rating/star-rating.component";

const routes: Routes = [
  {
    path: "",
    component: ContestOverlayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ContestOverlayPage,
    BarChartComponent,
    ResultsSwiperComponent,
    ContestInfoComponent,
    ResultsSubmitFormComponent,
    CustomRadioButtonsComponent,
    StarRatingComponent
  ]
})
export class ContestOverlayPageModule {}
