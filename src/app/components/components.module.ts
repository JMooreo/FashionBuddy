import { NgModule } from "@angular/core";
import { TinderCardComponent } from "./tinder-card/tinder-card.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [TinderCardComponent],
  imports: [IonicModule, CommonModule],
  exports: [TinderCardComponent]
})
export class SharedComponentsModule {}
