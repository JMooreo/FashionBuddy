import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ContestWinnerPage } from "./contest-winner.page";
import { SharedComponentsModule } from "src/app/components/components.module";

const routes: Routes = [
  {
    path: "",
    component: ContestWinnerPage
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
  declarations: [ContestWinnerPage]
})
export class ContestWinnerPageModule {}
