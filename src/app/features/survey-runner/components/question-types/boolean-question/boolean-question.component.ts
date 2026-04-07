import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-boolean-question',
  templateUrl: './boolean-question.component.html',
  styleUrls: ['./boolean-question.component.css']
})
export class BooleanQuestionComponent {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  value: 'true' | 'false' | '' = '';

  submit(): void {
    if (!this.value && this.question.isRequired) {
      return;
    }

    this.submitAnswer.emit({
      questionId: this.question.id,
      answerValue: this.value,
      optionIds: []
    });
  }
}
