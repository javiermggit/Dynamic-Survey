import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCompleteComponent } from './survey-complete.component';

describe('SurveyCompleteComponent', () => {
  let component: SurveyCompleteComponent;
  let fixture: ComponentFixture<SurveyCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyCompleteComponent]
    });
    fixture = TestBed.createComponent(SurveyCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
