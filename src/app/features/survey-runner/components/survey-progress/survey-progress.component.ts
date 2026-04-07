import { Component, Input } from '@angular/core';
import { SurveySessionDto, SurveySessionProgressDto } from '../../models/session.models';
import { SurveyDto } from '../../models/survey.models';

@Component({
  selector: 'app-survey-progress',
  templateUrl: './survey-progress.component.html',
  styleUrls: ['./survey-progress.component.css']
})
export class SurveyProgressComponent {
  @Input() survey!: SurveyDto;
  @Input() session!: SurveySessionDto;
  @Input() progress: SurveySessionProgressDto | null = null;

  get totalQuestions(): number {
    if (this.progress?.totalQuestions != null && this.progress.totalQuestions > 0) {
      return this.progress.totalQuestions;
    }

    return this.survey.sections.reduce(
      (count, section) => count + section.questions.length,
      0
    );
  }

  get answeredQuestions(): number {
    if (this.progress?.answeredQuestions != null) {
      return this.progress.answeredQuestions;
    }

    return this.session.answers.length;
  }

  get skippedQuestions(): number {
    if (this.progress?.skippedQuestions != null) {
      return this.progress.skippedQuestions;
    }

    return Math.max(0, this.totalQuestions - this.answeredQuestions);
  }

  get isCompleted(): boolean {
    return this.session.status === 'Completed';
  }

  get progressPercentage(): number {
    if (this.progress?.progressPercentage != null) {
      return this.isCompleted ? 100 : this.progress.progressPercentage;
    }

    if (this.isCompleted && this.totalQuestions > 0) {
      return 100;
    }

    if (this.totalQuestions === 0) {
      return 0;
    }

    return Math.round((this.answeredQuestions / this.totalQuestions) * 100);
  }
}
