import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyRunnerPageComponent } from './pages/survey-runner-page/survey-runner-page.component';
import { SurveySessionPageComponent } from './pages/survey-session-page/survey-session-page.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyRunnerPageComponent
  },
  {
    path: ':surveyId/start',
    component: SurveyRunnerPageComponent
  },
  {
    path: 'session/:sessionId',
    component: SurveySessionPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRunnerRoutingModule { }
