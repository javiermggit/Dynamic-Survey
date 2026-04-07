import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionHostComponent } from './survey-question-host.component';

describe('SurveyQuestionHostComponent', () => {
  let component: SurveyQuestionHostComponent;
  let fixture: ComponentFixture<SurveyQuestionHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyQuestionHostComponent]
    });
    fixture = TestBed.createComponent(SurveyQuestionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
