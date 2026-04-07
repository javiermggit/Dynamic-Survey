import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyProgressComponent } from './survey-progress.component';

describe('SurveyProgressComponent', () => {
  let component: SurveyProgressComponent;
  let fixture: ComponentFixture<SurveyProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyProgressComponent]
    });
    fixture = TestBed.createComponent(SurveyProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
