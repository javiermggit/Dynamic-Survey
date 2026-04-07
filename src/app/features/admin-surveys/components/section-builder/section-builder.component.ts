import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminSurveyService } from '../../services/admin-survey.service';

@Component({
  selector: 'app-section-builder',
  templateUrl: './section-builder.component.html',
  styleUrls: ['./section-builder.component.css']
})
export class SectionBuilderComponent {
  @Input() surveyId!: number;
  @Output() created = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    order: [1, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private adminSurveyService: AdminSurveyService
  ) {}

  submit(): void {
    if (this.form.invalid || !this.surveyId) {
      this.form.markAllAsTouched();
      return;
    }

    this.adminSurveyService.createSection(this.surveyId, {
      surveyId: this.surveyId,
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      displayOrder: this.form.value.order ?? 1,
      isActive: true
    }).subscribe({
      next: () => {
        this.form.reset({
          title: '',
          description: '',
          order: 1
        });
        this.created.emit();
      }
    });
  }
}
