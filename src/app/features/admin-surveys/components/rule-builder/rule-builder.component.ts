import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  AdminSurveyDto,
  AdminSurveyQuestionDto,
  AdminSurveyRuleDto
} from '../../models/admin-survey.models';
import { AdminSurveyService } from '../../services/admin-survey.service';

@Component({
  selector: 'app-rule-builder',
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.css']
})
export class RuleBuilderComponent {
  @Input() question!: AdminSurveyQuestionDto;
  @Input() survey!: AdminSurveyDto;
  @Output() created = new EventEmitter<void>();

  operators = ['Equals', 'NotEquals', 'Contains', 'GreaterThan', 'LessThan'];
  actionTypes = ['GoToQuestion', 'GoToSection', 'CompleteSurvey'];

  form = this.fb.group({
    operator: ['Equals', Validators.required],
    expectedValue: [''],
    expectedOptionId: [null as number | null],
    actionType: ['GoToQuestion', Validators.required],
    targetQuestionId: [null as number | null],
    targetSectionId: [null as number | null]
  });

  constructor(
    private fb: FormBuilder,
    private adminSurveyService: AdminSurveyService
  ) {}

  get rules(): AdminSurveyRuleDto[] {
    return this.question?.rules ?? [];
  }

  get allQuestions(): AdminSurveyQuestionDto[] {
    return this.survey?.sections?.flatMap(section => section.questions) ?? [];
  }

  getOperatorLabel(operator: string): string {
    const labels: Record<string, string> = {
      Equals: 'es igual a',
      NotEquals: 'es diferente de',
      Contains: 'contiene',
      GreaterThan: 'es mayor que',
      LessThan: 'es menor que'
    };

    return labels[operator] ?? operator;
  }

  getActionLabel(actionType: string): string {
    const labels: Record<string, string> = {
      GoToQuestion: 'Ir a una pregunta',
      GoToSection: 'Ir a una seccion',
      CompleteSurvey: 'Finalizar encuesta'
    };

    return labels[actionType] ?? actionType;
  }

  submit(): void {
    const payload = {
      surveyId: this.survey.id,
      name: `Regla ${this.question.code}`,
      description: `Regla creada desde la pregunta ${this.question.code}`,
      priority: 1,
      stopProcessing: true,
      conditions: [
        {
          questionId: this.question.id,
          operator: this.form.value.operator ?? 'Equals',
          expectedValue: this.form.value.expectedValue ?? '',
          logicalGroup: 1
        }
      ],
      actions: [
        {
          actionType: this.form.value.actionType ?? 'GoToQuestion',
          targetQuestionId: this.form.value.targetQuestionId ?? null,
          targetSectionId: this.form.value.targetSectionId ?? null,
          orderIndex: 1
        }
      ]
    };

    this.adminSurveyService.createRule(this.survey.id, payload).subscribe({
      next: () => {
        this.form.reset({
          operator: 'Equals',
          expectedValue: '',
          expectedOptionId: null,
          actionType: 'GoToQuestion',
          targetQuestionId: null,
          targetSectionId: null
        });
        this.created.emit();
      }
    });
  }
}
