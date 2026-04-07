import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDesignerPageComponent } from './survey-designer-page.component';

describe('SurveyDesignerPageComponent', () => {
  let component: SurveyDesignerPageComponent;
  let fixture: ComponentFixture<SurveyDesignerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyDesignerPageComponent]
    });
    fixture = TestBed.createComponent(SurveyDesignerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
