import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AdminSurveyDto,
  AdminSurveyQuestionDto,
  AdminSurveyRuleDto,
  AdminSurveySectionDto
} from '../../models/admin-survey.models';
import { AdminSurveyService } from '../../services/admin-survey.service';

type SurveyRuleView = AdminSurveyRuleDto & { sourceQuestionId?: number };

@Component({
  selector: 'app-survey-designer-page',
  templateUrl: './survey-designer-page.component.html',
  styleUrls: ['./survey-designer-page.component.css']
})
export class SurveyDesignerPageComponent implements OnInit {
  surveyId = 0;
  survey: AdminSurveyDto | null = null;
  selectedSectionId?: number;
  selectedQuestionId?: number;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private adminSurveyService: AdminSurveyService
  ) {}

  ngOnInit(): void {
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.surveyId) {
      this.errorMessage = 'No se encontro la encuesta.';
      return;
    }

    this.loadSurvey();
  }

  loadSurvey(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      survey: this.adminSurveyService.getSurvey(this.surveyId),
      rules: this.adminSurveyService.getSurveyRules(this.surveyId).pipe(
        catchError(() => of([]))
      )
    }).subscribe({
      next: ({ survey, rules }) => {
        this.survey = this.attachRules(survey, rules);
        this.syncSelection();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar el disenador.';
      }
    });
  }

  private attachRules(survey: AdminSurveyDto, rules: unknown[]): AdminSurveyDto {
    const mappedRules = this.mapRuleResponses(rules);

    if (!mappedRules.length) {
      return survey;
    }

    const questionRuleMap = new Map<number, AdminSurveyRuleDto[]>();

    mappedRules.forEach(rule => {
      const questionId = rule.sourceQuestionId;

      if (!questionId) {
        return;
      }

      const existing = questionRuleMap.get(questionId) ?? [];
      questionRuleMap.set(questionId, [...existing, rule]);
    });

    return {
      ...survey,
      sections: survey.sections.map(section => ({
        ...section,
        questions: section.questions.map(question => ({
          ...question,
          rules: questionRuleMap.get(question.id) ?? question.rules ?? []
        }))
      }))
    };
  }

  private mapRuleResponses(rules: unknown[]): SurveyRuleView[] {
    const mapped: SurveyRuleView[] = [];

    rules.forEach(rule => {
      const item = rule as {
        id?: number;
        conditions?: Array<{ questionId?: number; operator?: string; expectedValue?: string }>;
        actions?: Array<{
          actionType?: string;
          targetQuestionId?: number;
          targetSectionId?: number;
        }>;
      };

      const firstCondition = item.conditions?.[0];
      const firstAction = item.actions?.[0];

      if (!firstCondition || !firstAction) {
        return;
      }

      mapped.push({
        id: item.id ?? 0,
        operator: firstCondition.operator ?? 'Equals',
        expectedValue: firstCondition.expectedValue,
        actionType: firstAction.actionType ?? 'GoToQuestion',
        targetQuestionId: firstAction.targetQuestionId,
        targetSectionId: firstAction.targetSectionId,
        sourceQuestionId: firstCondition.questionId
      });
    });

    return mapped;
  }

  onSectionCreated(): void {
    this.loadSurvey();
  }

  onQuestionCreated(): void {
    this.loadSurvey();
  }

  onRuleCreated(): void {
    this.loadSurvey();
  }

  selectSection(sectionId: number): void {
    this.selectedSectionId = sectionId;
    const firstQuestion = this.activeSection?.questions[0];
    this.selectedQuestionId = firstQuestion?.id;
  }

  selectQuestion(questionId: number): void {
    this.selectedQuestionId = questionId;
  }

  get activeSection(): AdminSurveySectionDto | null {
    if (!this.survey?.sections.length) {
      return null;
    }

    return (
      this.survey.sections.find(section => section.id === this.selectedSectionId) ??
      this.survey.sections[0]
    );
  }

  get activeQuestion(): AdminSurveyQuestionDto | null {
    const questions = this.activeSection?.questions ?? [];

    if (!questions.length) {
      return null;
    }

    return (
      questions.find(question => question.id === this.selectedQuestionId) ??
      questions[0]
    );
  }

  getQuestionTypeLabel(type: string): string {
    if (type === 'Text') {
      return 'Texto corto';
    }

    if (type === 'Textarea') {
      return 'Texto largo';
    }

    if (type === 'SingleChoice') {
      return 'Seleccion unica';
    }

    if (type === 'MultipleChoice') {
      return 'Seleccion multiple';
    }

    if (type === 'Boolean') {
      return 'Si o no';
    }

    if (type === 'Number') {
      return 'Numero';
    }

    if (type === 'Date') {
      return 'Fecha';
    }

    if (type === 'Rating') {
      return 'Calificacion';
    }

    return type;
  }

  get totalQuestions(): number {
    if (!this.survey) {
      return 0;
    }

    return this.survey.sections.reduce(
      (count, section) => count + section.questions.length,
      0
    );
  }

  private syncSelection(): void {
    const section = this.activeSection ?? this.survey?.sections[0] ?? null;
    this.selectedSectionId = section?.id;

    const question = this.activeQuestion ?? section?.questions[0] ?? null;
    this.selectedQuestionId = question?.id;
  }
}
