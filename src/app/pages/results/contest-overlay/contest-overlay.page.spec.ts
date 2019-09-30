import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ContestOverlayPage } from "./contest-overlay.page";
import { NavParams, ModalController, AngularDelegate } from "@ionic/angular";
import { Contest, ContestOption } from "src/app/models/contest-model";

describe("ContestOverlayPage", () => {
  let component: ContestOverlayPage;
  let fixture: ComponentFixture<ContestOverlayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContestOverlayPage],
      providers: [
        ModalController,
        AngularDelegate,
        // tslint:disable-next-line: no-use-before-declare
        { provide: NavParams, useClass: MockNavParams }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestOverlayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class MockNavParams {
  get(param) {
    const contestOptions = [
      { id: "blah", imageUrl: "blah", votes: 0 } as ContestOption
    ];

    const contest = {
      options: contestOptions,
      contestOwner: "blah",
      createDateTime: "blah",
      closeDateTime: "blah",
      occasion: "blah",
      reportCount: 0,
      style: "blah"
    } as Contest;

    const data = { contest };

    return data[param];
  }
}
