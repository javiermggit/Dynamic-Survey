import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  AdminSurveyOptionDto,
  AdminSurveyQuestionDto
} from '../../models/admin-survey.models';
import { AdminSurveyService } from '../../services/admin-survey.service';

@Component({
  selector: 'app-option-editor',
  templateUrl: './option-editor.component.html',
  styleUrls: ['./option-editor.component.css']
})
export class OptionEditorComponent {
  @Input() question!: AdminSurveyQuestionDto;
  @Output() created = new EventEmitter<void>();

  form = this.fb.group({
    label: ['', Validators.required],
    value: ['', Validators.required],
    order: [1, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private adminSurveyService: AdminSurveyService
  ) {}

  get canHaveOptions(): boolean {
    return this.question?.type === 'SingleChoice' || this.question?.type === 'MultipleChoice';
  }

  get options(): AdminSurveyOptionDto[] {
    return this.question?.options ?? [];
  }

  submit(): void {
    if (!this.canHaveOptions || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.adminSurveyService.createOption(this.question.id, {
      questionId: this.question.id,
      label: this.form.value.label ?? '',
      value: this.form.value.value ?? '',
      displayOrder: this.form.value.order ?? 1,
      isActive: true
    }).subscribe({
      next: () => {
        this.form.reset({
          label: '',
          value: '',
          order: 1
        });
        this.created.emit();
      }
    });
  }
}
