import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionEditorComponent } from './option-editor.component';

describe('OptionEditorComponent', () => {
  let component: OptionEditorComponent;
  let fixture: ComponentFixture<OptionEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionEditorComponent]
    });
    fixture = TestBed.createComponent(OptionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
