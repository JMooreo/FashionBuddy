import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadPage } from './upload.page';
import { DatabaseService } from 'src/app/services/database/database.service';
import { ContestOption, Contest } from 'src/app/models/contest-model';
import { SharedComponentsModule } from 'src/app/components/components.module';

describe('UploadPage', () => {
  let component: UploadPage;
  let fixture: ComponentFixture<UploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPage],
      imports: [IonicModule.forRoot(), SharedComponentsModule],
      providers: [
        // tslint:disable-next-line: no-use-before-declare
        { provide: DatabaseService, useClass: DatabaseServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class DatabaseServiceStub {
  createContest(contest: Contest, contestOptions: Array<ContestOption>) {}
}
