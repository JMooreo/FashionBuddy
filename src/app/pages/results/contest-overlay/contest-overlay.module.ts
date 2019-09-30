import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ContestOverlayPage } from "./contest-overlay.page";
import { SharedComponentsModule } from "src/app/components/components.module";
import { BarChartComponent } from "src/app/components/bar-chart/bar-chart.component";

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
  declarations: [ContestOverlayPage, BarChartComponent]
})
export class ContestOverlayPageModule {}
