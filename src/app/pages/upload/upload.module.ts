import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UploadPage } from "./upload.page";
import { SharedComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    RouterModule.forChild([{ path: "", component: UploadPage }])
  ],
  declarations: [UploadPage]
})
export class UploadPageModule {}
