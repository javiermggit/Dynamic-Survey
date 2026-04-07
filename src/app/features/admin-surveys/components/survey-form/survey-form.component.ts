import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminSurveyDto, CreateSurveyRequest } from '../../models/admin-survey.models';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css']
})
export class SurveyFormComponent {
  @Input() initialData: Partial<CreateSurveyRequest & AdminSurveyDto> | null = null;
  @Input() saving = false;
  @Output() save = new EventEmitter<CreateSurveyRequest>();

  form = this.fb.group({
    title: [''],
    description: [''],
    isActive: [true]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue({
        title: this.initialData.name ?? this.initialData.title ?? '',
        description: this.initialData.description ?? '',
        isActive: this.initialData.isActive ?? true
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      name: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      isActive: this.form.value.isActive ?? true,
      version: 1
    });
  }
}
