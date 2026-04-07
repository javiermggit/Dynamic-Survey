export interface AdminSurveyDto {
  id: number;
  title: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Archived';
  sections: AdminSurveySectionDto[];
}

export interface AdminSurveySectionDto {
  id: number;
  title: string;
  description?: string;
  order: number;
  questions: AdminSurveyQuestionDto[];
}

export interface AdminSurveyQuestionDto {
  id: number;
  code: string;
  text: string;
  type: string;
  isRequired: boolean;
  order: number;
  placeholder?: string;
  helpText?: string;
  options: AdminSurveyOptionDto[];
  rules: AdminSurveyRuleDto[];
}

export interface AdminSurveyOptionDto {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface AdminSurveyRuleDto {
  id: number;
  operator: string;
  expectedValue?: string;
  expectedOptionId?: number;
  actionType: string;
  targetQuestionId?: number;
  targetSectionId?: number;
}

export interface AdminSurveySummary {
  id: number;
  title: string;
  description?: string;
  status: 'Draft' | 'Published' | 'Archived';
}

export interface CreateSurveyRequest {
  name: string;
  description?: string;
  isActive: boolean;
  version: number;
}

export interface CreateSectionRequest {
  surveyId: number;
  title: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateQuestionRequest {
  sectionId: number;
  code: string;
  text: string;
  questionType: string;
  isRequired: boolean;
  displayOrder: number;
  placeholder?: string;
  helpText?: string;
  isActive: boolean;
}

export interface CreateOptionRequest {
  questionId: number;
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateRuleRequest {
  surveyId: number;
  name: string;
  description?: string | null;
  priority: number;
  stopProcessing: boolean;
  conditions: CreateRuleConditionRequest[];
  actions: CreateRuleActionRequest[];
}

export interface CreateRuleConditionRequest {
  questionId: number;
  operator: string;
  expectedValue?: string | null;
  logicalGroup: number;
}

export interface CreateRuleActionRequest {
  actionType: string;
  targetQuestionId?: number | null;
  targetSectionId?: number | null;
  orderIndex: number;
}
