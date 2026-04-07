import {
  AdminSurveyDto,
  AdminSurveyOptionDto,
  AdminSurveyQuestionDto,
  AdminSurveyRuleDto,
  AdminSurveySectionDto,
  CreateOptionRequest,
  CreateQuestionRequest,
  CreateRuleRequest,
  CreateSectionRequest,
  CreateSurveyRequest
} from '../../features/admin-surveys/models/admin-survey.models';
import {
  CreateSessionRequest,
  SubmitAnswerRequest,
  SurveySessionDto
} from '../../features/survey-runner/models/session.models';

interface FlatQuestionRef {
  sectionId: number;
  sectionTitle: string;
  question: AdminSurveyQuestionDto;
}

class MockApiStore {
  private surveyIdCounter = 2;
  private sectionIdCounter = 100;
  private questionIdCounter = 1000;
  private optionIdCounter = 10000;
  private ruleIdCounter = 20000;
  private sessionIdCounter = 1;
  private answerIdCounter = 1;

  surveys: AdminSurveyDto[] = [
    {
      id: 1,
      title: 'Encuesta de satisfaccion',
      description: 'Flujo base de ejemplo para probar el runner y el admin.',
      status: 'Published',
      sections: [
        {
          id: 1,
          title: 'Inicio',
          description: 'Datos generales',
          order: 1,
          questions: [
            {
              id: 1,
              code: 'NOMBRE',
              text: 'Cual es tu nombre?',
              type: 'Text',
              isRequired: true,
              order: 1,
              placeholder: 'Escribe tu nombre',
              helpText: 'Usaremos este dato solo para identificar la sesion.',
              options: [],
              rules: []
            },
            {
              id: 2,
              code: 'EXPERIENCIA',
              text: 'Como calificas tu experiencia general?',
              type: 'Rating',
              isRequired: true,
              order: 2,
              placeholder: '',
              helpText: '1 es muy mala y 5 es excelente.',
              options: [],
              rules: []
            }
          ]
        },
        {
          id: 2,
          title: 'Detalle',
          description: 'Preguntas de profundizacion',
          order: 2,
          questions: [
            {
              id: 3,
              code: 'RECOMENDAR',
              text: 'Recomendarias nuestro servicio?',
              type: 'Boolean',
              isRequired: true,
              order: 1,
              placeholder: '',
              helpText: '',
              options: [],
              rules: []
            },
            {
              id: 4,
              code: 'MEJORA',
              text: 'Que deberiamos mejorar?',
              type: 'Textarea',
              isRequired: false,
              order: 2,
              placeholder: 'Comparte tu sugerencia',
              helpText: '',
              options: [],
              rules: []
            }
          ]
        }
      ]
    }
  ];

  sessions: SurveySessionDto[] = [];

  getSurveys(): AdminSurveyDto[] {
    return this.surveys.map(survey => structuredClone(survey));
  }

  getSurvey(id: number): AdminSurveyDto | undefined {
    const survey = this.surveys.find(item => item.id === id);
    return survey ? structuredClone(survey) : undefined;
  }

  createSurvey(payload: CreateSurveyRequest): { id: number } {
    const survey: AdminSurveyDto = {
      id: this.surveyIdCounter++,
      title: payload.name,
      description: payload.description,
      status: payload.isActive ? 'Published' : 'Draft',
      sections: []
    };

    this.surveys.push(survey);
    return { id: survey.id };
  }

  updateSurvey(id: number, payload: CreateSurveyRequest): void {
    const survey = this.surveys.find(item => item.id === id);

    if (!survey) {
      return;
    }

    survey.title = payload.name;
    survey.description = payload.description;
    survey.status = payload.isActive ? 'Published' : 'Draft';
  }

  createSection(surveyId: number, payload: CreateSectionRequest): void {
    const survey = this.surveys.find(item => item.id === surveyId);

    if (!survey) {
      return;
    }

    const section: AdminSurveySectionDto = {
      id: this.sectionIdCounter++,
      title: payload.title,
      description: payload.description,
      order: payload.displayOrder,
      questions: []
    };

    survey.sections.push(section);
    survey.sections.sort((a, b) => a.order - b.order);
  }

  createQuestion(sectionId: number, payload: CreateQuestionRequest): void {
    const section = this.findSection(sectionId);

    if (!section) {
      return;
    }

    const question: AdminSurveyQuestionDto = {
      id: this.questionIdCounter++,
      code: payload.code,
      text: payload.text,
      type: payload.questionType,
      isRequired: payload.isRequired,
      order: payload.displayOrder,
      placeholder: payload.placeholder,
      helpText: payload.helpText,
      options: [],
      rules: []
    };

    section.questions.push(question);
    section.questions.sort((a, b) => a.order - b.order);
  }

  createOption(questionId: number, payload: CreateOptionRequest): void {
    const question = this.findQuestion(questionId);

    if (!question) {
      return;
    }

    const option: AdminSurveyOptionDto = {
      id: this.optionIdCounter++,
      label: payload.label,
      value: payload.value,
      order: payload.displayOrder
    };

    question.options.push(option);
    question.options.sort((a, b) => a.order - b.order);
  }

  getSurveyRules(surveyId: number): Array<{
    id: number;
    conditions: Array<{ questionId?: number; operator?: string; expectedValue?: string }>;
    actions: Array<{ actionType?: string; targetQuestionId?: number; targetSectionId?: number }>;
  }> {
    const survey = this.surveys.find(item => item.id === surveyId);

    if (!survey) {
      return [];
    }

    return survey.sections.flatMap(section =>
      section.questions.flatMap(question =>
        (question.rules ?? []).map(rule => ({
          id: rule.id,
          conditions: [
            {
              questionId: question.id,
              operator: rule.operator,
              expectedValue: rule.expectedValue
            }
          ],
          actions: [
            {
              actionType: rule.actionType,
              targetQuestionId: rule.targetQuestionId,
              targetSectionId: rule.targetSectionId
            }
          ]
        }))
      )
    );
  }

  createRule(payload: CreateRuleRequest): void {
    const questionId = payload.conditions[0]?.questionId;
    const question = this.findQuestion(questionId ?? 0);

    if (!question) {
      return;
    }

    const firstCondition = payload.conditions[0];
    const firstAction = payload.actions[0];

    const rule: AdminSurveyRuleDto = {
      id: this.ruleIdCounter++,
      operator: firstCondition?.operator ?? 'Equals',
      expectedValue: firstCondition?.expectedValue ?? undefined,
      actionType: firstAction?.actionType ?? 'GoToQuestion',
      targetQuestionId: firstAction?.targetQuestionId ?? undefined,
      targetSectionId: firstAction?.targetSectionId ?? undefined
    };

    question.rules.push(rule);
  }

  createSession(payload: CreateSessionRequest): SurveySessionDto | undefined {
    const survey = this.surveys.find(item => item.id === payload.surveyId);

    if (!survey) {
      return undefined;
    }

    const first = this.getOrderedQuestions(survey)[0];

    const session: SurveySessionDto = {
      id: this.sessionIdCounter++,
      surveyId: survey.id,
      surveyName: survey.title,
      userId: payload.userId,
      status: 'InProgress',
      currentSectionId: first?.sectionId,
      currentSectionTitle: first?.sectionTitle,
      currentQuestionId: first?.question.id,
      currentQuestionText: first?.question.text,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: []
    };

    this.sessions.push(session);
    return structuredClone(session);
  }

  getSession(sessionId: number): SurveySessionDto | undefined {
    const session = this.sessions.find(item => item.id === sessionId);
    return session ? structuredClone(session) : undefined;
  }

  saveAnswer(sessionId: number, payload: SubmitAnswerRequest): SurveySessionDto | undefined {
    const session = this.sessions.find(item => item.id === sessionId);

    if (!session) {
      return undefined;
    }

    const survey = this.surveys.find(item => item.id === session.surveyId);

    if (!survey) {
      return undefined;
    }

    const orderedQuestions = this.getOrderedQuestions(survey);
    const currentIndex = orderedQuestions.findIndex(
      item => item.question.id === payload.questionId
    );
    const current = orderedQuestions[currentIndex];

    if (!current) {
      return structuredClone(session);
    }

    const existingIndex = session.answers.findIndex(
      answer => answer.questionId === payload.questionId
    );

    const answer = {
      answerId:
        existingIndex >= 0
          ? session.answers[existingIndex].answerId
          : this.answerIdCounter++,
      questionId: current.question.id,
      questionCode: current.question.code,
      questionText: current.question.text,
      answerValue: payload.answerValue,
      optionIds: payload.optionIds ?? []
    };

    if (existingIndex >= 0) {
      session.answers[existingIndex] = answer;
    } else {
      session.answers.push(answer);
    }

    const next = orderedQuestions[currentIndex + 1];

    if (next) {
      session.currentSectionId = next.sectionId;
      session.currentSectionTitle = next.sectionTitle;
      session.currentQuestionId = next.question.id;
      session.currentQuestionText = next.question.text;
      session.status = 'InProgress';
      session.completedAt = null;
    } else {
      session.currentSectionId = undefined;
      session.currentSectionTitle = undefined;
      session.currentQuestionId = undefined;
      session.currentQuestionText = undefined;
      session.status = 'Completed';
      session.completedAt = new Date().toISOString();
    }

    return structuredClone(session);
  }

  private getOrderedQuestions(survey: AdminSurveyDto): FlatQuestionRef[] {
    return survey.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .flatMap(section =>
        section.questions
          .slice()
          .sort((a, b) => a.order - b.order)
          .map(question => ({
            sectionId: section.id,
            sectionTitle: section.title,
            question
          }))
      );
  }

  private findSection(sectionId: number): AdminSurveySectionDto | undefined {
    return this.surveys
      .flatMap(survey => survey.sections)
      .find(section => section.id === sectionId);
  }

  private findQuestion(questionId: number): AdminSurveyQuestionDto | undefined {
    return this.surveys
      .flatMap(survey => survey.sections)
      .flatMap(section => section.questions)
      .find(question => question.id === questionId);
  }
}

export const mockApiStore = new MockApiStore();
