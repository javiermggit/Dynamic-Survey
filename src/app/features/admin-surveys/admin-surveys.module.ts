import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminSurveysRoutingModule } from './admin-surveys-routing.module';
import { SurveyListPageComponent } from './pages/survey-list-page/survey-list-page.component';
import { SurveyCreatePageComponent } from './pages/survey-create-page/survey-create-page.component';
import { SurveyEditPageComponent } from './pages/survey-edit-page/survey-edit-page.component';
import { SurveyDesignerPageComponent } from './pages/survey-designer-page/survey-designer-page.component';
import { SurveyFormComponent } from './components/survey-form/survey-form.component';
import { SectionBuilderComponent } from './components/section-builder/section-builder.component';
import { QuestionBuilderComponent } from './components/question-builder/question-builder.component';
import { OptionEditorComponent } from './components/option-editor/option-editor.component';
import { RuleBuilderComponent } from './components/rule-builder/rule-builder.component';
import { SurveyPreviewComponent } from './components/survey-preview/survey-preview.component';


@NgModule({
  declarations: [
    SurveyListPageComponent,
    SurveyCreatePageComponent,
    SurveyEditPageComponent,
    SurveyDesignerPageComponent,
    SurveyFormComponent,
    SectionBuilderComponent,
    QuestionBuilderComponent,
    OptionEditorComponent,
    RuleBuilderComponent,
    SurveyPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSurveysRoutingModule
  ]
})
export class AdminSurveysModule { }
