import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubmitAnswerRequest } from '../../models/session.models';
import { SurveyRunnerService } from '../../services/survey-runner.service';
import { SurveySessionStateService } from '../../services/survey-session-state.service';

@Component({
  selector: 'app-survey-session-page',
  templateUrl: './survey-session-page.component.html',
  styleUrls: ['./survey-session-page.component.css']
})
export class SurveySessionPageComponent implements OnInit, OnDestroy {
  sessionId = 0;
  loading = false;
  saving = false;
  errorMessage = '';
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private surveyRunnerService: SurveyRunnerService,
    public state: SurveySessionStateService
  ) {}

  ngOnInit(): void {
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));

    if (!this.sessionId) {
      this.errorMessage = 'No se encontro una sesion valida.';
      return;
    }

    this.loadSession();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get hasConfiguredQuestions(): boolean {
    return (
      this.state.survey?.sections.some(section => section.questions.length > 0) ?? false
    );
  }

  loadSession(): void {
    this.loading = true;
    this.errorMessage = '';

    const sessionSub = this.surveyRunnerService.getSession(this.sessionId).subscribe({
      next: session => {
        this.state.setSession(session);

        const surveySub = this.surveyRunnerService.getSurvey(session.surveyId).subscribe({
          next: survey => {
            this.state.setSurvey(survey);
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'No fue posible cargar la encuesta asociada.';
          }
        });

        this.subscription.add(surveySub);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar la sesion.';
      }
    });

    this.subscription.add(sessionSub);
  }

  onSubmitAnswer(payload: SubmitAnswerRequest): void {
    this.saving = true;

    const saveSub = this.surveyRunnerService.submitAnswer(this.sessionId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.loadSession();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'No fue posible guardar la respuesta.';
      }
    });

    this.subscription.add(saveSub);
  }
}
