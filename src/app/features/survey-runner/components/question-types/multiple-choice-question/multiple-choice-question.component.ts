import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmitAnswerRequest } from '../../../models/session.models';
import { SurveyQuestionDto } from '../../../models/survey.models';

@Component({
  selector: 'app-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.css']
})
export class MultipleChoiceQuestionComponent {
  @Input() question!: SurveyQuestionDto;
  @Input() saving = false;
  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();

  selectedOptionIds: number[] = [];

  toggleOption(optionId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedOptionIds.includes(optionId)) {
        this.selectedOptionIds = [...this.selectedOptionIds, optionId];
      }
      return;
    }

    this.selectedOptionIds = this.selectedOptionIds.filter(id => id !== optionId);
  }

  submit(): void {
    if (this.question.isRequired && this.selectedOptionIds.length === 0) {
      return;
    }

    const selectedOptions =
      this.question.options?.filter(option => this.selectedOptionIds.includes(option.id)) ?? [];

    this.submitAnswer.emit({
      questionId: this.question.id,
      answerValue: selectedOptions.map(option => option.value || option.label).join(','),
      optionIds: this.selectedOptionIds
    });
  }
}
