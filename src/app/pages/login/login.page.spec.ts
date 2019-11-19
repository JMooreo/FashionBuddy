import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginPage } from "./login.page";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { UrlSerializer } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { AngularDelegate, ModalController } from "@ionic/angular";
import { FCM } from "@ionic-native/fcm/ngx";
import { AppVersion } from '@ionic-native/app-version/ngx';

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Location,
        UrlSerializer,
        AngularDelegate,
        ModalController,
        FCM,
        AppVersion,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // tslint:disable-next-line: no-use-before-declare
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class AuthServiceStub {
  createUserWithEmailAndPassword(email: string, password: string) {}
}
