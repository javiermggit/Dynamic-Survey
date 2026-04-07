import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SurveyDto } from '../../models/survey.models';

@Component({
  selector: 'app-survey-start',
  templateUrl: './survey-start.component.html',
  styleUrls: ['./survey-start.component.css']
})
export class SurveyStartComponent {
  @Input() survey!: SurveyDto;
  @Input() starting = false;
  @Output() start = new EventEmitter<void>();

  get totalQuestions(): number {
    return this.survey.sections.reduce(
      (count, section) => count + section.questions.length,
      0
    );
  }

  get canStart(): boolean {
    return this.totalQuestions > 0;
  }

  onStart(): void {
    if (!this.canStart) {
      return;
    }

    this.start.emit();
  }
}
