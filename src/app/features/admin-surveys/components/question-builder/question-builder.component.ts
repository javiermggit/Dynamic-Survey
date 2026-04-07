import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminSurveyService } from '../../services/admin-survey.service';

@Component({
  selector: 'app-question-builder',
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.css']
})
export class QuestionBuilderComponent {
  @Input() sectionId!: number;
  @Output() created = new EventEmitter<void>();

  questionTypes = [
    'Text',
    'Textarea',
    'SingleChoice',
    'MultipleChoice',
    'Boolean',
    'Number',
    'Date',
    'Rating'
  ];

  form = this.fb.group({
    code: ['', Validators.required],
    text: ['', Validators.required],
    type: ['Text', Validators.required],
    isRequired: [false, Validators.required],
    order: [1, Validators.required],
    placeholder: [''],
    helpText: ['']
  });

  constructor(
    private fb: FormBuilder,
    private adminSurveyService: AdminSurveyService
  ) {}

  submit(): void {
    if (this.form.invalid || !this.sectionId) {
      this.form.markAllAsTouched();
      return;
    }

    this.adminSurveyService.createQuestion(this.sectionId, {
      sectionId: this.sectionId,
      code: this.form.value.code ?? '',
      text: this.form.value.text ?? '',
      questionType: this.form.value.type ?? 'Text',
      isRequired: this.form.value.isRequired ?? false,
      displayOrder: this.form.value.order ?? 1,
      placeholder: this.form.value.placeholder ?? '',
      helpText: this.form.value.helpText ?? '',
      isActive: true
    }).subscribe({
      next: () => {
        this.form.reset({
          code: '',
          text: '',
          type: 'Text',
          isRequired: false,
          order: 1,
          placeholder: '',
          helpText: ''
        });
        this.created.emit();
      }
    });
  }
}
