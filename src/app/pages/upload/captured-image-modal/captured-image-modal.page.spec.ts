import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NavParams, ModalController, AngularDelegate } from "@ionic/angular";

import { CapturedImageModalPage } from "./captured-image-modal.page";

describe("CapturedImageModalPage", () => {
  let component: CapturedImageModalPage;
  let fixture: ComponentFixture<CapturedImageModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CapturedImageModalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ModalController,
        AngularDelegate,
        // tslint:disable-next-line: no-use-before-declare
        { provide: NavParams, useClass: MockNavParams }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturedImageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  class MockNavParams {
    data = {};

    get(param) {
      return this.data[param];
    }
  }
});
