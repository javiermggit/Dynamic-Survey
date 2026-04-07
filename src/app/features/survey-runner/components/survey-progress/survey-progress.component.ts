import { Component, Input } from '@angular/core';
import { SurveySessionDto } from '../../models/session.models';
import { SurveyDto } from '../../models/survey.models';

@Component({
  selector: 'app-survey-progress',
  templateUrl: './survey-progress.component.html',
  styleUrls: ['./survey-progress.component.css']
})
export class SurveyProgressComponent {
  @Input() survey!: SurveyDto;
  @Input() session!: SurveySessionDto;

  get totalQuestions(): number {
    return this.survey.sections.reduce(
      (count, section) => count + section.questions.length,
      0
    );
  }

  get answeredQuestions(): number {
    return this.session.answers.length;
  }

  get skippedQuestions(): number {
    return Math.max(0, this.totalQuestions - this.answeredQuestions);
  }

  get isCompleted(): boolean {
    return this.session.status === 'Completed';
  }

  get progressPercentage(): number {
    if (this.isCompleted && this.totalQuestions > 0) {
      return 100;
    }

    if (this.totalQuestions === 0) {
      return 0;
    }

    return Math.round((this.answeredQuestions / this.totalQuestions) * 100);
  }
}
