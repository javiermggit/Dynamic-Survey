import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.css']
})
export class TextQuestionComponent implements OnInit {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  form = this.fb.group({
    answerValue: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.question.isRequired) {
      this.form.controls.answerValue.addValidators(Validators.required);
      this.form.controls.answerValue.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitAnswer.emit({
      questionId: this.question.id,
      answerValue: this.form.value.answerValue ?? '',
      optionIds: []
    });
  }
}
