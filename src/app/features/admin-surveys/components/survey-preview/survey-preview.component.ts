import { Component, Input } from '@angular/core';
import { AdminSurveyDto } from '../../models/admin-survey.models';

@Component({
  selector: 'app-survey-preview',
  templateUrl: './survey-preview.component.html',
  styleUrls: ['./survey-preview.component.css']
})
export class SurveyPreviewComponent {
  @Input() survey: AdminSurveyDto | null = null;
}
