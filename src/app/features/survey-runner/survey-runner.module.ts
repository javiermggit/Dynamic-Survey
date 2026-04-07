import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SurveyRunnerRoutingModule } from './survey-runner-routing.module';
import { SurveyRunnerPageComponent } from './pages/survey-runner-page/survey-runner-page.component';
import { SurveySessionPageComponent } from './pages/survey-session-page/survey-session-page.component';
import { SurveyStartComponent } from './components/survey-start/survey-start.component';
import { SurveyProgressComponent } from './components/survey-progress/survey-progress.component';
import { SurveyQuestionHostComponent } from './components/survey-question-host/survey-question-host.component';
import { SurveyNavigationComponent } from './components/survey-navigation/survey-navigation.component';
import { SurveyCompleteComponent } from './components/survey-complete/survey-complete.component';
import { TextQuestionComponent } from './components/question-types/text-question/text-question.component';
import { TextareaQuestionComponent } from './components/question-types/textarea-question/textarea-question.component';
import { SingleChoiceQuestionComponent } from './components/question-types/single-choice-question/single-choice-question.component';
import { MultipleChoiceQuestionComponent } from './components/question-types/multiple-choice-question/multiple-choice-question.component';
import { BooleanQuestionComponent } from './components/question-types/boolean-question/boolean-question.component';
import { NumberQuestionComponent } from './components/question-types/number-question/number-question.component';
import { DateQuestionComponent } from './components/question-types/date-question/date-question.component';
import { RatingQuestionComponent } from './components/question-types/rating-question/rating-question.component';


@NgModule({
  declarations: [
    SurveyRunnerPageComponent,
    SurveySessionPageComponent,
    SurveyStartComponent,
    SurveyProgressComponent,
    SurveyQuestionHostComponent,
    SurveyNavigationComponent,
    SurveyCompleteComponent,
    TextQuestionComponent,
    TextareaQuestionComponent,
    SingleChoiceQuestionComponent,
    MultipleChoiceQuestionComponent,
    BooleanQuestionComponent,
    NumberQuestionComponent,
    DateQuestionComponent,
    RatingQuestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SurveyRunnerRoutingModule
  ]
})
export class SurveyRunnerModule { }
