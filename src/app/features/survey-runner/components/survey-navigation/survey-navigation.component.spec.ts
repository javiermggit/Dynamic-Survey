import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyNavigationComponent } from './survey-navigation.component';

describe('SurveyNavigationComponent', () => {
  let component: SurveyNavigationComponent;
  let fixture: ComponentFixture<SurveyNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyNavigationComponent]
    });
    fixture = TestBed.createComponent(SurveyNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
