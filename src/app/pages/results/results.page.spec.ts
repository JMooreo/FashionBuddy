import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ResultsPage } from "./results.page";
import { SharedComponentsModule } from "src/app/components/components.module";
import { AuthService } from "src/app/services/auth/auth.service";
import { DatabaseService } from "src/app/services/database/database.service";
import { resolve } from "q";
import { LocationStrategy, PathLocationStrategy, Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";

describe("ResultsPage", () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsPage],
      imports: [
        IonicModule.forRoot(),
        SharedComponentsModule,
        RouterTestingModule
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // tslint:disable-next-line: no-use-before-declare
        { provide: AuthService, useClass: AuthServiceStub },
        // tslint:disable-next-line: no-use-before-declare
        { provide: DatabaseService, useClass: DatabaseServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

class AuthServiceStub {
  getUserId() {}
}

class DatabaseServiceStub {
  getAllContestsWhereUserIsContestOwner() {
    return resolve("123");
  }
}
