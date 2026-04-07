import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiFeedbackService } from '../../../../core/services/ui-feedback.service';
import { SubmitAnswerRequest, SurveySessionProgressDto } from '../../models/session.models';
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
  completing = false;
  errorMessage = '';
  progress: SurveySessionProgressDto | null = null;
  private hasRedirectedAfterCompletion = false;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyRunnerService: SurveyRunnerService,
    private uiFeedbackService: UiFeedbackService,
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

        if (session.status === 'Completed') {
          this.loading = false;
          this.navigateToRunner('La encuesta ya estaba finalizada. Te llevamos al listado.', 'info');
          return;
        }

        const surveySub = forkJoin({
          survey: this.surveyRunnerService.getSurvey(session.surveyId),
          progress: this.surveyRunnerService.getSessionProgress(this.sessionId).pipe(
            catchError(() => of(null))
          )
        }).subscribe({
          next: ({ survey, progress }) => {
            this.progress = progress;
            this.loading = false;
            this.state.setSurvey(survey);
            this.redirectIfCompleted(session.status === 'Completed');
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
        this.progress = null;
        this.errorMessage = 'No fue posible cargar la sesion.';
      }
    });

    this.subscription.add(sessionSub);
  }

  onSubmitAnswer(payload: SubmitAnswerRequest): void {
    this.saving = true;

    const saveSub = this.surveyRunnerService.submitAnswer(this.sessionId, payload).subscribe({
      next: session => {
        this.saving = false;

        this.state.setSession(session);

        if (session.status === 'Completed') {
          this.navigateToRunner('La encuesta se finalizo correctamente.');
          return;
        }

        this.loadSession();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'No fue posible guardar la respuesta.';
      }
    });

    this.subscription.add(saveSub);
  }

  onCompleteSession(): void {
    if (!this.sessionId || this.completing || this.state.session?.status === 'Completed') {
      return;
    }

    this.completing = true;
    this.errorMessage = '';

    const completeSub = this.surveyRunnerService.completeSession(this.sessionId).subscribe({
      next: session => {
        this.completing = false;
        this.state.setSession(session);
        this.navigateToRunner('La encuesta se finalizo correctamente.');
      },
      error: error => {
        this.completing = false;
        const message = String(error?.message ?? '').toLowerCase();

        if (
          message.includes('inactive') ||
          message.includes('inactiva') ||
          message.includes('completed') ||
          message.includes('completada')
        ) {
          this.navigateToRunner(
            'La sesion ya estaba finalizada. Te llevamos al listado.',
            'info'
          );
          return;
        }

        this.errorMessage = 'No fue posible finalizar la sesion.';
      }
    });

    this.subscription.add(completeSub);
  }

  private redirectIfCompleted(
    isCompleted: boolean,
    message = 'La encuesta se finalizo. Te llevamos de vuelta al listado.'
  ): void {
    if (!isCompleted || this.hasRedirectedAfterCompletion) {
      return;
    }

    this.navigateToRunner(message);
  }

  private navigateToRunner(
    message: string,
    type: 'success' | 'info' = 'success'
  ): void {
    if (this.hasRedirectedAfterCompletion) {
      return;
    }

    this.hasRedirectedAfterCompletion = true;

    if (type === 'info') {
      this.uiFeedbackService.showInfo(message);
    } else {
      this.uiFeedbackService.showSuccess(message);
    }

    this.state.clear();
    void this.router.navigate(['/runner']);
  }
}
