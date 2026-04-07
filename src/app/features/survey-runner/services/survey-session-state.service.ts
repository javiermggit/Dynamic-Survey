import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SurveyDto,
  SurveyQuestionDto,
  SurveySectionDto
} from '../models/survey.models';
import { SurveySessionDto } from '../models/session.models';

@Injectable({
  providedIn: 'root'
})
export class SurveySessionStateService {
  private surveySubject = new BehaviorSubject<SurveyDto | null>(null);
  private sessionSubject = new BehaviorSubject<SurveySessionDto | null>(null);

  survey$ = this.surveySubject.asObservable();
  session$ = this.sessionSubject.asObservable();

  setSurvey(survey: SurveyDto): void {
    this.surveySubject.next(survey);
  }

  setSession(session: SurveySessionDto): void {
    this.sessionSubject.next(session);
  }

  get survey(): SurveyDto | null {
    return this.surveySubject.value;
  }

  get session(): SurveySessionDto | null {
    return this.sessionSubject.value;
  }

  getCurrentSection(): SurveySectionDto | null {
    const survey = this.survey;
    const session = this.session;

    if (!survey || !session) {
      return null;
    }

    if (session.currentSectionId) {
      return survey.sections.find(section => section.id === session.currentSectionId) ?? null;
    }

    const fallbackQuestion = this.getFallbackQuestion();

    if (!fallbackQuestion) {
      return null;
    }

    return (
      survey.sections.find(section =>
        section.questions.some(question => question.id === fallbackQuestion.id)
      ) ?? null
    );
  }

  getCurrentQuestion(): SurveyQuestionDto | null {
    const session = this.session;

    if (session?.status === 'Completed') {
      return null;
    }

    const section = this.getCurrentSection();

    if (section && session?.currentQuestionId) {
      const currentQuestion =
        section.questions.find(question => question.id === session.currentQuestionId) ?? null;

      if (currentQuestion) {
        return currentQuestion;
      }
    }

    return this.getFallbackQuestion();
  }

  clear(): void {
    this.surveySubject.next(null);
    this.sessionSubject.next(null);
  }

  private getFallbackQuestion(): SurveyQuestionDto | null {
    const survey = this.survey;
    const session = this.session;

    if (!survey || !session) {
      return null;
    }

    const answeredQuestionIds = new Set(session.answers.map(answer => answer.questionId));

    const orderedSections = survey.sections.slice().sort((a, b) => a.order - b.order);

    for (const section of orderedSections) {
      const orderedQuestions = section.questions.slice().sort((a, b) => a.order - b.order);
      const nextQuestion = orderedQuestions.find(question => !answeredQuestionIds.has(question.id));

      if (nextQuestion) {
        return nextQuestion;
      }
    }

    return null;
  }
}
