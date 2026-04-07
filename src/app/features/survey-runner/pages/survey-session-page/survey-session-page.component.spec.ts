import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySessionPageComponent } from './survey-session-page.component';

describe('SurveySessionPageComponent', () => {
  let component: SurveySessionPageComponent;
  let fixture: ComponentFixture<SurveySessionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveySessionPageComponent]
    });
    fixture = TestBed.createComponent(SurveySessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
