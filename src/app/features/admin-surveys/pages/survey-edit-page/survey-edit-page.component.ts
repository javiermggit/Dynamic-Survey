import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiFeedbackService } from '../../../../core/services/ui-feedback.service';
import { AdminSurveyService } from '../../services/admin-survey.service';
import { AdminSurveyDto, CreateSurveyRequest } from '../../models/admin-survey.models';

@Component({
  selector: 'app-survey-edit-page',
  templateUrl: './survey-edit-page.component.html',
  styleUrls: ['./survey-edit-page.component.css']
})
export class SurveyEditPageComponent implements OnInit {
  surveyId = 0;
  survey: AdminSurveyDto | null = null;
  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private adminSurveyService: AdminSurveyService,
    private uiFeedbackService: UiFeedbackService
  ) {}

  ngOnInit(): void {
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.surveyId) {
      this.errorMessage = 'No se encontro la encuesta.';
      return;
    }

    this.loading = true;

    this.adminSurveyService.getSurvey(this.surveyId).subscribe({
      next: survey => {
        this.survey = survey;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar la encuesta.';
      }
    });
  }

  onSave(payload: CreateSurveyRequest): void {
    if (!this.surveyId || this.saving) {
      return;
    }

    this.errorMessage = '';
    this.saving = true;

    this.adminSurveyService.updateSurvey(this.surveyId, payload).subscribe({
      next: () => {
        this.saving = false;

        if (this.survey) {
          this.survey = { ...this.survey, ...payload };
        }

        this.uiFeedbackService.showSuccess('Encuesta actualizada correctamente.');
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error?.message || 'No fue posible actualizar la encuesta.';
      }
    });
  }
}
