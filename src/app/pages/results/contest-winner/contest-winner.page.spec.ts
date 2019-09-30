import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ContestWinnerPage } from "./contest-winner.page";
import { NavParams, ModalController, AngularDelegate } from "@ionic/angular";
import { ContestOption, Contest } from "src/app/models/contest-model";

describe("ContestWinnerPage", () => {
  let component: ContestWinnerPage;
  let fixture: ComponentFixture<ContestWinnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContestWinnerPage],
      providers: [
        // tslint:disable-next-line: no-use-before-declare
        { provide: NavParams, useClass: MockNavParams },
        ModalController,
        AngularDelegate
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestWinnerPage);
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
