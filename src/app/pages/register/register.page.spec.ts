import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterPage } from "./register.page";
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { UrlSerializer } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { ModalController, AngularDelegate } from '@ionic/angular';

describe("RegisterPage", () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Location,
        UrlSerializer,
        AngularDelegate,
        ModalController,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // tslint:disable-next-line: no-use-before-declare
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      declarations: [RegisterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
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
