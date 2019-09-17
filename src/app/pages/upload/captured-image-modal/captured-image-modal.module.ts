import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { ImageCropperModule } from "ngx-image-cropper";

import { CapturedImageModalPage } from "./captured-image-modal.page";

const routes: Routes = [
  {
    path: "",
    component: CapturedImageModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CapturedImageModalPage]
})
export class CapturedImageModalPageModule {}
