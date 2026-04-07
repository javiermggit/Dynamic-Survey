import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-rating-question',
  templateUrl: './rating-question.component.html',
  styleUrls: ['./rating-question.component.css']
})
export class RatingQuestionComponent {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  value = 0;
  readonly ratings = [1, 2, 3, 4, 5];

  submit(): void {
    if (!this.value && this.question.isRequired) {
      return;
    }

    this.submitAnswer.emit({
      questionId: this.question.id,
      answerValue: this.value ? String(this.value) : '',
      optionIds: []
    });
  }
}
