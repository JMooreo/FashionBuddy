import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { VotingPage } from "./voting.page";
import { TinderCardComponent } from "src/app/components/tinder-card/tinder-card.component";
import { DatabaseService } from "src/app/services/database/database.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Contest } from "src/app/models/contest-model";

describe("VotingPage", () => {
  let component: VotingPage;
  let fixture: ComponentFixture<VotingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VotingPage, TinderCardComponent],
      imports: [IonicModule.forRoot(), BrowserAnimationsModule],
      providers: [
        // tslint:disable-next-line: no-use-before-declare
        { provide: DatabaseService, useClass: DatabaseServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class DatabaseServiceStub {
  getAllContestsForUser() {}
}
