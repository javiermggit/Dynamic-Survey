import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyStartComponent } from './survey-start.component';

describe('SurveyStartComponent', () => {
  let component: SurveyStartComponent;
  let fixture: ComponentFixture<SurveyStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyStartComponent]
    });
    fixture = TestBed.createComponent(SurveyStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
