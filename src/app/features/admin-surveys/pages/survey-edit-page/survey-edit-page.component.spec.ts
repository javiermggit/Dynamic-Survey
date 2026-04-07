import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEditPageComponent } from './survey-edit-page.component';

describe('SurveyEditPageComponent', () => {
  let component: SurveyEditPageComponent;
  let fixture: ComponentFixture<SurveyEditPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyEditPageComponent]
    });
    fixture = TestBed.createComponent(SurveyEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
