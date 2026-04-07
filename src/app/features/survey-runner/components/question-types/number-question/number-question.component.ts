import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-number-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.css']
})
export class NumberQuestionComponent implements OnInit {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  form = this.fb.group({
    answerValue: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const validators = [Validators.pattern(/^-?\d+(\.\d+)?$/)];

    if (this.question.isRequired) {
      validators.unshift(Validators.required);
    }

    this.form.controls.answerValue.addValidators(validators);
    this.form.controls.answerValue.updateValueAndValidity();
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
