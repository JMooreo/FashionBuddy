import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SettingsPage } from "./settings.page";
import { AuthService } from "src/app/services/auth/auth.service";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { UrlSerializer } from "@angular/router";
import { ModalController, AngularDelegate } from "@ionic/angular";
import { FCM } from "@ionic-native/fcm/ngx";

describe("SettingsPage", () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      providers: [
        Location,
        UrlSerializer,
        ModalController,
        AngularDelegate,
        FCM,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // tslint:disable-next-line: no-use-before-declare
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class AuthServiceStub {
  deleteUser(email: string, password: string) {}
}
