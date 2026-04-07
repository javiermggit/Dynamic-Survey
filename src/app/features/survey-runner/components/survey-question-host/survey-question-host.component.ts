import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmitAnswerRequest } from '../../models/session.models';
import { SurveyQuestionDto } from '../../models/survey.models';

@Component({
  selector: 'app-survey-question-host',
  templateUrl: './survey-question-host.component.html',
  styleUrls: ['./survey-question-host.component.css']
})
export class SurveyQuestionHostComponent {
  @Input() question: SurveyQuestionDto | null = null;
  @Input() saving = false;

  @Output() submitAnswer = new EventEmitter<SubmitAnswerRequest>();
}
