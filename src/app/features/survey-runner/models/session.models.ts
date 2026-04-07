export interface CreateSessionRequest {
  surveyId: number;
  userId?: string;
}

export interface SubmitAnswerRequest {
  questionId: number;
  answerValue?: string;
  optionIds?: number[];
}

export interface SurveySessionDto {
  id: number;
  surveyId: number;
  surveyName: string;
  userId?: string;
  status: 'InProgress' | 'Completed';
  currentSectionId?: number;
  currentSectionTitle?: string;
  currentQuestionId?: number;
  currentQuestionText?: string;
  startedAt: string;
  completedAt?: string | null;
  answers: SessionAnswerDto[];
}

export interface SurveySessionProgressDto {
  answeredQuestions: number;
  totalQuestions: number;
  progressPercentage: number;
  skippedQuestions?: number;
}

export interface SessionAnswerDto {
  answerId: number;
  questionId: number;
  questionCode: string;
  questionText: string;
  answerValue?: string;
  optionIds: number[];
}
