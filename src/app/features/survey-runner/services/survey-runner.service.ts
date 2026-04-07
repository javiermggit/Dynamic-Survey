import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SurveyDto } from '../models/survey.models';
import {
  CreateSessionRequest,
  SubmitAnswerRequest,
  SurveySessionDto
} from '../models/session.models';

@Injectable({
  providedIn: 'root'
})
export class SurveyRunnerService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSurvey(surveyId: number): Observable<SurveyDto> {
    return this.http
      .get<unknown>(`${this.apiUrl}/surveys/${surveyId}`)
      .pipe(map(response => this.normalizeSurvey(response)));
  }

  createSession(payload: CreateSessionRequest): Observable<SurveySessionDto> {
    return this.http
      .post<unknown>(`${this.apiUrl}/sessions`, payload)
      .pipe(map(response => this.normalizeSession(response)));
  }

  getSession(sessionId: number): Observable<SurveySessionDto> {
    return this.http
      .get<unknown>(`${this.apiUrl}/sessions/${sessionId}`)
      .pipe(map(response => this.normalizeSession(response)));
  }

  submitAnswer(
    sessionId: number,
    payload: SubmitAnswerRequest
  ): Observable<SurveySessionDto> {
    return this.http
      .post<unknown>(
        `${this.apiUrl}/sessions/${sessionId}/answers`,
        this.normalizeSubmitAnswerPayload(payload)
      )
      .pipe(map(response => this.normalizeSession(response)));
  }

  private normalizeSurvey(response: unknown): SurveyDto {
    const survey = (response ?? {}) as Record<string, unknown>;
    const sections = Array.isArray(survey['sections']) ? (survey['sections'] as unknown[]) : [];

    return {
      id: this.readNumber(survey, ['id']),
      title: this.readString(survey, ['title', 'name']),
      description: this.readOptionalString(survey, ['description']),
      status: this.readSurveyStatus(survey),
      sections: this.deduplicateBy(
        sections.map(section => {
          const sectionData = section as Record<string, unknown>;
          const questions = Array.isArray(sectionData['questions'])
            ? (sectionData['questions'] as unknown[])
            : [];

          return {
            id: this.readNumber(sectionData, ['id']),
            title: this.readString(sectionData, ['title', 'name']),
            description: this.readOptionalString(sectionData, ['description']),
            order: this.readNumber(sectionData, ['order', 'displayOrder']),
            questions: this.deduplicateBy(
              questions.map(question => {
                const questionData = question as Record<string, unknown>;
                const options = Array.isArray(questionData['options'])
                  ? (questionData['options'] as unknown[])
                  : [];

                return {
                  id: this.readNumber(questionData, ['id']),
                  code: this.readString(questionData, ['code']),
                  text: this.readString(questionData, ['text']),
                  type: this.normalizeQuestionType(
                    this.readString(questionData, ['type', 'questionType'])
                  ),
                  isRequired: Boolean(questionData['isRequired'] ?? false),
                  order: this.readNumber(questionData, ['order', 'displayOrder']),
                  placeholder: this.readOptionalString(questionData, ['placeholder']),
                  helpText: this.readOptionalString(questionData, ['helpText']),
                  options: this.deduplicateBy(
                    options.map(option => {
                      const optionData = option as Record<string, unknown>;

                      return {
                        id: this.readNumber(optionData, ['id']),
                        label: this.readString(optionData, ['label']),
                        value: this.readString(optionData, ['value']),
                        order: this.readNumber(optionData, ['order', 'displayOrder'])
                      };
                    }),
                    option => `${option.label}|${option.value}|${option.order}`
                  )
                };
              }),
              question => `${question.code}|${question.text}|${question.order}|${question.type}`,
              (current, incoming) =>
                (incoming.options?.length ?? 0) > (current.options?.length ?? 0) ||
                (!!incoming.placeholder && !current.placeholder)
            )
          };
        }),
        section => `${section.title}|${section.order}`,
        (current, incoming) => (incoming.questions?.length ?? 0) > (current.questions?.length ?? 0)
      )
    };
  }

  private normalizeSession(response: unknown): SurveySessionDto {
    const session = (response ?? {}) as Record<string, unknown>;

    return {
      id: this.readNumber(session, ['id', 'sessionId']),
      surveyId: this.readNumber(session, ['surveyId']),
      surveyName: this.readString(session, ['surveyName', 'surveyTitle', 'name']),
      userId: this.readOptionalString(session, ['userId']),
      status: this.readStatus(session),
      currentSectionId: this.readOptionalNumber(session, ['currentSectionId']),
      currentSectionTitle: this.readOptionalString(session, ['currentSectionTitle']),
      currentQuestionId: this.readOptionalNumber(session, ['currentQuestionId']),
      currentQuestionText: this.readOptionalString(session, ['currentQuestionText']),
      startedAt: this.readString(session, ['startedAt', 'createdAt']),
      completedAt: this.readOptionalString(session, ['completedAt']),
      answers: Array.isArray(session['answers']) ? (session['answers'] as any[]).map(answer => ({
        answerId: this.readNumber(answer as Record<string, unknown>, ['answerId', 'id']),
        questionId: this.readNumber(answer as Record<string, unknown>, ['questionId']),
        questionCode: this.readString(answer as Record<string, unknown>, ['questionCode', 'code']),
        questionText: this.readString(answer as Record<string, unknown>, ['questionText', 'text']),
        answerValue: this.readOptionalString(answer as Record<string, unknown>, ['answerValue']),
        optionIds: Array.isArray((answer as Record<string, unknown>)['optionIds'])
          ? (((answer as Record<string, unknown>)['optionIds'] as unknown[]) ?? []).map(value =>
              Number(value)
            )
          : []
      })) : []
    };
  }

  private readNumber(source: Record<string, unknown>, keys: string[]): number {
    const value = this.findValue(source, keys);
    return value != null ? Number(value) : 0;
  }

  private readOptionalNumber(source: Record<string, unknown>, keys: string[]): number | undefined {
    const value = this.findValue(source, keys);
    return value != null ? Number(value) : undefined;
  }

  private readString(source: Record<string, unknown>, keys: string[]): string {
    const value = this.findValue(source, keys);
    return value != null ? String(value) : '';
  }

  private readOptionalString(
    source: Record<string, unknown>,
    keys: string[]
  ): string | undefined {
    const value = this.findValue(source, keys);
    return value != null ? String(value) : undefined;
  }

  private readStatus(source: Record<string, unknown>): 'InProgress' | 'Completed' {
    const raw = this.readString(source, ['status']);
    return raw === 'Completed' ? 'Completed' : 'InProgress';
  }

  private readSurveyStatus(
    source: Record<string, unknown>
  ): 'Draft' | 'Published' | 'Archived' {
    const raw = this.readString(source, ['status']);

    if (raw === 'Published' || raw === 'Archived') {
      return raw;
    }

    return 'Draft';
  }

  private normalizeQuestionType(value: string): SurveyDto['sections'][number]['questions'][number]['type'] {
    const normalized = value.toLowerCase();

    if (normalized === 'textarea') {
      return 'Textarea';
    }

    if (normalized === 'text') {
      return 'Text';
    }

    if (normalized === 'singlechoice') {
      return 'SingleChoice';
    }

    if (normalized === 'multiplechoice') {
      return 'MultipleChoice';
    }

    if (normalized === 'boolean') {
      return 'Boolean';
    }

    if (normalized === 'number') {
      return 'Number';
    }

    if (normalized === 'date') {
      return 'Date';
    }

    if (normalized === 'rating') {
      return 'Rating';
    }

    return 'Text';
  }

  private findValue(source: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) {
        return source[key];
      }
    }

    return undefined;
  }

  private normalizeSubmitAnswerPayload(payload: SubmitAnswerRequest): SubmitAnswerRequest {
    return {
      questionId: Number(payload.questionId),
      answerValue:
        payload.answerValue === undefined || payload.answerValue === null
          ? ''
          : String(payload.answerValue),
      optionIds: Array.isArray(payload.optionIds) ? payload.optionIds.map(value => Number(value)) : []
    };
  }

  private deduplicateBy<T>(
    items: T[],
    keySelector: (item: T) => string,
    replaceWhen?: (current: T, incoming: T) => boolean
  ): T[] {
    const map = new Map<string, T>();

    items.forEach(item => {
      const key = keySelector(item);
      const current = map.get(key);

      if (!current) {
        map.set(key, item);
        return;
      }

      if (replaceWhen?.(current, item)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  }
}
