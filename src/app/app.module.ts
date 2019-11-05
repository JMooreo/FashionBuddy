import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { Camera } from "@ionic-native/camera/ngx";
import { CapturedImageModalPageModule } from "./pages/upload/captured-image-modal/captured-image-modal.module";
import { ContestOverlayPageModule } from "./pages/results/contest-overlay/contest-overlay.module";
import { FcmService } from "./services/fcm/fcm.service";
import { AuthService } from "./services/auth/auth.service";
import { DatabaseService } from "./services/database/database.service";
// import { FCM } from "@ionic-native/fcm/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    CapturedImageModalPageModule,
    ContestOverlayPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatabaseService,
    FcmService,
    // FCM,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
