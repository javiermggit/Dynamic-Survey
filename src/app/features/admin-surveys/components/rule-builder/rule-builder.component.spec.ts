import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleBuilderComponent } from './rule-builder.component';

describe('RuleBuilderComponent', () => {
  let component: RuleBuilderComponent;
  let fixture: ComponentFixture<RuleBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleBuilderComponent]
    });
    fixture = TestBed.createComponent(RuleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
