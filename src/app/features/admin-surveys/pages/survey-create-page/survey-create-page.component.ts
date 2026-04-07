import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AdminSurveyService } from '../../services/admin-survey.service';
import { CreateSurveyRequest } from '../../models/admin-survey.models';

@Component({
  selector: 'app-survey-create-page',
  templateUrl: './survey-create-page.component.html',
  styleUrls: ['./survey-create-page.component.css']
})
export class SurveyCreatePageComponent {
  errorMessage = '';
  readonly usingMocks = environment.useMocks;

  constructor(
    private router: Router,
    private adminSurveyService: AdminSurveyService
  ) {}

  onSave(payload: CreateSurveyRequest): void {
    this.errorMessage = '';

    this.adminSurveyService.createSurvey(payload).subscribe({
      next: response => {
        const surveyId = response.id ?? response.surveyId;

        if (surveyId) {
          this.router.navigate(['/admin', surveyId, 'designer']);
          return;
        }

        this.router.navigate(['/admin']);
      },
      error: () => {
        this.errorMessage = 'No fue posible crear la encuesta.';
      }
    });
  }
}
