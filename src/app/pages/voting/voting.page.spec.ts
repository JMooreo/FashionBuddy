import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VotingPage } from './voting.page';
import { TinderCardComponent } from 'src/app/components/tinder-card/tinder-card.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Contest } from 'src/app/models/contest-model';

describe('VotingPage', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class DatabaseServiceStub {
  getAllContestsForUser() {
    const testContestOptions = [
      { imageUrl: 'https://via.placeholder.com/1080x1920?text=Option_1', votes: 0 },
      { imageUrl: 'https://via.placeholder.com/1080x1920?text=Option_2', votes: 0 }
    ];
    const testCreateDateTime = new Date(Date.now());
    const testCloseDateTime = new Date('2020');

    const contest = {
      createDateTime: testCreateDateTime.toISOString(),
      closeDateTime: testCloseDateTime.toISOString(),
      occasion: 'testContest occasion',
      reportCount: 0,
      style: 'test Style'
    };
    return {...contest, options: testContestOptions} as Contest;
  }
}
