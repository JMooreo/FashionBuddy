import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestOverlayPage } from './contest-overlay.page';

describe('ContestOverlayPage', () => {
  let component: ContestOverlayPage;
  let fixture: ComponentFixture<ContestOverlayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestOverlayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestOverlayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
