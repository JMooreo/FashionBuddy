import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from './register.page';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UrlSerializer } from '@angular/router';


describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        Location,
        UrlSerializer,
        { provide: LocationStrategy, useClass: PathLocationStrategy }
      ],
      declarations: [RegisterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
