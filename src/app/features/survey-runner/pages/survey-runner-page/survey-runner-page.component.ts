import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSurveySummary } from '../../../admin-surveys/models/admin-survey.models';
import { AdminSurveyService } from '../../../admin-surveys/services/admin-survey.service';
import { SurveyDto } from '../../models/survey.models';
import { SurveyRunnerService } from '../../services/survey-runner.service';
import { SurveySessionStateService } from '../../services/survey-session-state.service';

@Component({
  selector: 'app-survey-runner-page',
  templateUrl: './survey-runner-page.component.html',
  styleUrls: ['./survey-runner-page.component.css']
})
export class SurveyRunnerPageComponent implements OnInit {
  survey: SurveyDto | null = null;
  surveys: AdminSurveySummary[] = [];
  surveyId?: number;
  loading = false;
  starting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminSurveyService: AdminSurveyService,
    private surveyRunnerService: SurveyRunnerService,
    private state: SurveySessionStateService
  ) {}

  getStatusLabel(status: AdminSurveySummary['status']): string {
    if (status === 'Published') {
      return 'Disponible';
    }

    if (status === 'Archived') {
      return 'Archivada';
    }

    return 'Borrador';
  }

  ngOnInit(): void {
    const surveyIdParam = this.route.snapshot.paramMap.get('surveyId');

    if (!surveyIdParam) {
      this.loadSurveyList();
      return;
    }

    const surveyId = Number(surveyIdParam);

    if (!surveyId) {
      this.errorMessage = 'No se encontro una encuesta valida.';
      return;
    }

    this.surveyId = surveyId;
    this.loadSurvey(surveyId);
  }

  startSurveyFromList(surveyId: number): void {
    this.router.navigate(['/runner', surveyId, 'start']);
  }

  private loadSurveyList(): void {
    this.loading = true;

    this.adminSurveyService.getSurveys().subscribe({
      next: surveys => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar el listado de encuestas.';
      }
    });
  }

  private loadSurvey(surveyId: number): void {
    this.loading = true;

    this.surveyRunnerService.getSurvey(surveyId).subscribe({
      next: survey => {
        this.survey = survey;
        this.state.setSurvey(survey);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar la encuesta.';
      }
    });
  }

  startSurvey(): void {
    if (!this.survey) {
      return;
    }

    this.starting = true;

    this.surveyRunnerService
      .createSession({
        surveyId: this.survey.id,
        userId: 'javier'
      })
      .subscribe({
        next: session => {
          this.starting = false;

          if (!session.id) {
            this.errorMessage =
              'La API creo la sesion, pero no devolvio el id de la sesion. POST /api/sessions debe responder con el identificador creado para poder navegar al runner.';
            return;
          }

          this.state.setSession(session);
          this.router.navigate(['/runner/session', session.id]);
        },
        error: () => {
          this.starting = false;
          this.errorMessage = 'No fue posible iniciar la sesion.';
        }
      });
  }
}
