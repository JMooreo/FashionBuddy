import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordResetPage } from "./password-reset.page";
import { UrlSerializer } from "@angular/router";
import {
  LocationStrategy,
  PathLocationStrategy,
  Location
} from "@angular/common";
import { AuthService } from "src/app/services/auth/auth.service";

describe("PasswordResetPage", () => {
  let component: PasswordResetPage;
  let fixture: ComponentFixture<PasswordResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetPage],
      providers: [
        Location,
        UrlSerializer,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // tslint:disable-next-line: no-use-before-declare
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class AuthServiceStub {
  sendPasswordResetEmail(email: string) {}
}
