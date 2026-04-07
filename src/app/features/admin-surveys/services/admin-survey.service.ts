import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminSurveyDto,
  AdminSurveySummary,
  CreateOptionRequest,
  CreateQuestionRequest,
  CreateRuleRequest,
  CreateSectionRequest,
  CreateSurveyRequest
} from '../models/admin-survey.models';

@Injectable({
  providedIn: 'root'
})
export class AdminSurveyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSurveys(): Observable<AdminSurveySummary[]> {
    return this.http
      .get<unknown[]>(`${this.apiUrl}/admin/surveys`)
      .pipe(map(response => response.map(item => this.normalizeSurveySummary(item))));
  }

  getSurvey(id: number): Observable<AdminSurveyDto> {
    return this.http
      .get<unknown>(`${this.apiUrl}/admin/surveys/${id}`)
      .pipe(map(response => this.normalizeSurvey(response)));
  }

  createSurvey(payload: CreateSurveyRequest): Observable<{ id?: number; surveyId?: number }> {
    return this.http.post<{ id?: number; surveyId?: number }>(
      `${this.apiUrl}/admin/surveys`,
      payload
    );
  }

  updateSurvey(id: number, payload: CreateSurveyRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/surveys/${id}`, payload);
  }

  createSection(surveyId: number, payload: CreateSectionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/surveys/${surveyId}/sections`, payload);
  }

  createQuestion(sectionId: number, payload: CreateQuestionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/sections/${sectionId}/questions`, payload);
  }

  createOption(questionId: number, payload: CreateOptionRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/admin/questions/${questionId}/options`,
      payload
    );
  }

  getSurveyRules(surveyId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.apiUrl}/admin/surveys/${surveyId}/rules`);
  }

  getSectionQuestions(sectionId: number) {
    return this.http
      .get<unknown[]>(`${this.apiUrl}/admin/sections/${sectionId}/questions`)
      .pipe(map(response => response.map(item => this.normalizeQuestion(item))));
  }

  getQuestionOptions(questionId: number) {
    return this.http
      .get<unknown[]>(`${this.apiUrl}/admin/questions/${questionId}/options`)
      .pipe(map(response => response.map(item => this.normalizeOption(item))));
  }

  createRule(surveyId: number, payload: CreateRuleRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/surveys/${surveyId}/rules`, payload);
  }

  private normalizeSurveySummary(item: unknown): AdminSurveySummary {
    const survey = (item ?? {}) as Record<string, unknown>;

    return {
      id: Number(survey['id'] ?? 0),
      title: String(survey['title'] ?? survey['name'] ?? ''),
      description: survey['description'] ? String(survey['description']) : undefined,
      status: this.normalizeStatus(survey)
    };
  }

  private normalizeSurvey(item: unknown): AdminSurveyDto {
    const survey = (item ?? {}) as Record<string, unknown>;
    const sections = Array.isArray(survey['sections']) ? (survey['sections'] as unknown[]) : [];

    return {
      id: Number(survey['id'] ?? 0),
      title: String(survey['title'] ?? survey['name'] ?? ''),
      description: survey['description'] ? String(survey['description']) : undefined,
      status: this.normalizeStatus(survey),
      sections: this.deduplicateBy(
        sections.map(section => {
          const sectionData = section as Record<string, unknown>;
          const questions = Array.isArray(sectionData['questions'])
            ? (sectionData['questions'] as unknown[])
            : [];

          return {
            id: Number(sectionData['id'] ?? 0),
            title: String(sectionData['title'] ?? sectionData['name'] ?? ''),
            description: sectionData['description']
              ? String(sectionData['description'])
              : undefined,
            order: Number(sectionData['order'] ?? sectionData['displayOrder'] ?? 0),
            questions: this.deduplicateBy(
              questions.map(question => this.normalizeQuestion(question)),
              question => `${question.code}|${question.text}|${question.order}|${question.type}`
            )
          };
        }),
        section => `${section.title}|${section.order}`
      )
    };
  }

  private normalizeQuestion(item: unknown) {
    const questionData = (item ?? {}) as Record<string, unknown>;
    const options = Array.isArray(questionData['options'])
      ? (questionData['options'] as unknown[])
      : [];

    return {
      id: Number(questionData['id'] ?? 0),
      code: String(questionData['code'] ?? ''),
      text: String(questionData['text'] ?? ''),
      type: String(questionData['type'] ?? questionData['questionType'] ?? ''),
      isRequired: Boolean(questionData['isRequired'] ?? false),
      order: Number(questionData['order'] ?? questionData['displayOrder'] ?? 0),
      placeholder: questionData['placeholder']
        ? String(questionData['placeholder'])
        : undefined,
      helpText: questionData['helpText']
        ? String(questionData['helpText'])
        : undefined,
      options: this.deduplicateBy(
        options.map(option => this.normalizeOption(option)),
        option => `${option.label}|${option.value}|${option.order}`
      ),
      rules: []
    };
  }

  private normalizeOption(item: unknown) {
    const optionData = (item ?? {}) as Record<string, unknown>;

    return {
      id: Number(optionData['id'] ?? 0),
      label: String(optionData['label'] ?? ''),
      value: String(optionData['value'] ?? ''),
      order: Number(optionData['order'] ?? optionData['displayOrder'] ?? 0)
    };
  }

  private normalizeStatus(source: Record<string, unknown>): 'Draft' | 'Published' | 'Archived' {
    const raw = String(source['status'] ?? '');

    if (raw === 'Published' || raw === 'Archived') {
      return raw;
    }

    if (source['isActive'] === true) {
      return 'Published';
    }

    return 'Draft';
  }

  private deduplicateBy<T>(items: T[], keySelector: (item: T) => string): T[] {
    const seen = new Set<string>();

    return items.filter(item => {
      const key = keySelector(item);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
}
