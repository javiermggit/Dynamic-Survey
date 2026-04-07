import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { mockApiStore } from '../mocks/mock-api.data';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  constructor(private uiFeedbackService: UiFeedbackService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.uiFeedbackService.beginLoading();

    if (!environment.useMocks) {
      return next.handle(req).pipe(finalize(() => this.uiFeedbackService.endLoading()));
    }

    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    const body = req.body as Record<string, unknown> | null;

    if (req.method === 'GET' && path === '/api/surveys') {
      return this.respond(mockApiStore.getSurveys());
    }

    if (req.method === 'GET' && /^\/api\/surveys\/\d+$/.test(path)) {
      const surveyId = this.getLastNumber(path);
      return this.respond(mockApiStore.getSurvey(surveyId));
    }

    if (req.method === 'GET' && /^\/api\/admin\/surveys\/\d+$/.test(path)) {
      const surveyId = this.getLastNumber(path);
      return this.respond(mockApiStore.getSurvey(surveyId));
    }

    if (req.method === 'GET' && /^\/api\/admin\/sections\/\d+\/questions$/.test(path)) {
      return this.respond(mockApiStore.getSectionQuestions(this.getPathNumber(path, 2)));
    }

    if (req.method === 'GET' && /^\/api\/admin\/questions\/\d+\/options$/.test(path)) {
      return this.respond(mockApiStore.getQuestionOptions(this.getPathNumber(path, 2)));
    }

    if (req.method === 'POST' && path === '/api/admin/surveys') {
      return this.respond(
        mockApiStore.createSurvey({
          name: String(body?.['name'] ?? ''),
          description: String(body?.['description'] ?? ''),
          isActive: Boolean(body?.['isActive'] ?? true),
          version: Number(body?.['version'] ?? 1)
        })
      );
    }

    if (req.method === 'PUT' && /^\/api\/admin\/surveys\/\d+$/.test(path)) {
      mockApiStore.updateSurvey(this.getLastNumber(path), {
        name: String(body?.['name'] ?? ''),
        description: String(body?.['description'] ?? ''),
        isActive: Boolean(body?.['isActive'] ?? true),
        version: Number(body?.['version'] ?? 1)
      });
      return this.respond({});
    }

    if (req.method === 'POST' && /^\/api\/admin\/surveys\/\d+\/sections$/.test(path)) {
      mockApiStore.createSection(this.getPathNumber(path, 2), {
        surveyId: this.getPathNumber(path, 2),
        title: String(body?.['title'] ?? ''),
        description: String(body?.['description'] ?? ''),
        displayOrder: Number(body?.['displayOrder'] ?? 1),
        isActive: Boolean(body?.['isActive'] ?? true)
      });
      return this.respond({});
    }

    if (req.method === 'POST' && /^\/api\/admin\/sections\/\d+\/questions$/.test(path)) {
      mockApiStore.createQuestion(this.getPathNumber(path, 2), {
        sectionId: this.getPathNumber(path, 2),
        code: String(body?.['code'] ?? ''),
        text: String(body?.['text'] ?? ''),
        questionType: String(body?.['questionType'] ?? 'Text'),
        isRequired: Boolean(body?.['isRequired'] ?? false),
        displayOrder: Number(body?.['displayOrder'] ?? 1),
        placeholder: String(body?.['placeholder'] ?? ''),
        helpText: String(body?.['helpText'] ?? ''),
        isActive: Boolean(body?.['isActive'] ?? true)
      });
      return this.respond({});
    }

    if (req.method === 'POST' && /^\/api\/admin\/questions\/\d+\/options$/.test(path)) {
      mockApiStore.createOption(this.getPathNumber(path, 2), {
        questionId: this.getPathNumber(path, 2),
        label: String(body?.['label'] ?? ''),
        value: String(body?.['value'] ?? ''),
        displayOrder: Number(body?.['displayOrder'] ?? 1),
        isActive: Boolean(body?.['isActive'] ?? true)
      });
      return this.respond({});
    }

    if (req.method === 'GET' && /^\/api\/admin\/surveys\/\d+\/rules$/.test(path)) {
      return this.respond(mockApiStore.getSurveyRules(this.getPathNumber(path, 2)));
    }

    if (req.method === 'POST' && /^\/api\/admin\/surveys\/\d+\/rules$/.test(path)) {
      mockApiStore.createRule({
        surveyId: this.getPathNumber(path, 2),
        name: String(body?.['name'] ?? 'Regla'),
        description: body?.['description'] ? String(body['description']) : null,
        priority: Number(body?.['priority'] ?? 1),
        stopProcessing: Boolean(body?.['stopProcessing'] ?? true),
        conditions: Array.isArray(body?.['conditions'])
          ? (body?.['conditions'] as Array<Record<string, unknown>>).map(condition => ({
              questionId: Number(condition['questionId'] ?? 0),
              operator: String(condition['operator'] ?? 'Equals'),
              expectedValue: condition['expectedValue']
                ? String(condition['expectedValue'])
                : null,
              logicalGroup: Number(condition['logicalGroup'] ?? 1)
            }))
          : [],
        actions: Array.isArray(body?.['actions'])
          ? (body?.['actions'] as Array<Record<string, unknown>>).map(action => ({
              actionType: String(action['actionType'] ?? 'GoToQuestion'),
              targetQuestionId:
                action['targetQuestionId'] != null ? Number(action['targetQuestionId']) : null,
              targetSectionId:
                action['targetSectionId'] != null ? Number(action['targetSectionId']) : null,
              orderIndex: Number(action['orderIndex'] ?? 1)
            }))
          : []
      });
      return this.respond({});
    }

    if (req.method === 'POST' && path === '/api/sessions') {
      return this.respond(
        mockApiStore.createSession({
          surveyId: Number(body?.['surveyId'] ?? 0),
          userId: body?.['userId'] ? String(body['userId']) : undefined
        })
      );
    }

    if (req.method === 'GET' && /^\/api\/sessions\/\d+$/.test(path)) {
      return this.respond(mockApiStore.getSession(this.getLastNumber(path)));
    }

    if (req.method === 'GET' && /^\/api\/sessions\/\d+\/progress$/.test(path)) {
      return this.respond(mockApiStore.getSessionProgress(this.getPathNumber(path, 2)));
    }

    if (req.method === 'POST' && /^\/api\/sessions\/\d+\/complete$/.test(path)) {
      return this.respond(mockApiStore.completeSession(this.getPathNumber(path, 2)));
    }

    if (req.method === 'POST' && /^\/api\/sessions\/\d+\/answers$/.test(path)) {
      return this.respond(
        mockApiStore.saveAnswer(this.getPathNumber(path, 2), {
          questionId: Number(body?.['questionId'] ?? 0),
          answerValue: body?.['answerValue'] ? String(body['answerValue']) : undefined,
          optionIds: Array.isArray(body?.['optionIds'])
            ? (body?.['optionIds'] as number[]).map(value => Number(value))
            : []
        })
      );
    }

    return next.handle(req).pipe(finalize(() => this.uiFeedbackService.endLoading()));
  }

  private respond(body: unknown): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status: 200, body })).pipe(
      delay(250),
      finalize(() => this.uiFeedbackService.endLoading())
    );
  }

  private getLastNumber(path: string): number {
    const parts = path.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  private getPathNumber(path: string, index: number): number {
    const parts = path.split('/').filter(Boolean);
    return Number(parts[index]);
  }
}
