import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyRunnerPageComponent } from './survey-runner-page.component';

describe('SurveyRunnerPageComponent', () => {
  let component: SurveyRunnerPageComponent;
  let fixture: ComponentFixture<SurveyRunnerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyRunnerPageComponent]
    });
    fixture = TestBed.createComponent(SurveyRunnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
