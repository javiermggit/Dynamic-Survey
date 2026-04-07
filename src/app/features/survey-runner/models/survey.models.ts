export type QuestionType =
  | 'Text'
  | 'Textarea'
  | 'SingleChoice'
  | 'MultipleChoice'
  | 'Boolean'
  | 'Number'
  | 'Date'
  | 'Rating';

export interface SurveyDto {
  id: number;
  title: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Archived';
  sections: SurveySectionDto[];
}

export interface SurveySectionDto {
  id: number;
  title: string;
  description?: string;
  order: number;
  questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  id: number;
  code: string;
  text: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  placeholder?: string;
  helpText?: string;
  options?: SurveyOptionDto[];
}

export interface SurveyOptionDto {
  id: number;
  label: string;
  value: string;
  order: number;
}
