import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-single-choice-question',
  templateUrl: './single-choice-question.component.html',
  styleUrls: ['./single-choice-question.component.css']
})
export class SingleChoiceQuestionComponent {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  selectedOptionId: number | null = null;

  submit(): void {
    if (!this.selectedOptionId && this.question.isRequired) {
      return;
    }

    const selectedOption =
      this.question.options?.find(option => option.id === this.selectedOptionId) ?? null;

    this.submitAnswer.emit({
      questionId: this.question.id,
      answerValue: selectedOption?.value ?? selectedOption?.label ?? '',
      optionIds: this.selectedOptionId ? [this.selectedOptionId] : []
    });
  }
}
