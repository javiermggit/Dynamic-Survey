import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyCreatePageComponent } from './pages/survey-create-page/survey-create-page.component';
import { SurveyDesignerPageComponent } from './pages/survey-designer-page/survey-designer-page.component';
import { SurveyEditPageComponent } from './pages/survey-edit-page/survey-edit-page.component';
import { SurveyListPageComponent } from './pages/survey-list-page/survey-list-page.component';

const routes: Routes = [
  { path: '', component: SurveyListPageComponent },
  { path: 'create', component: SurveyCreatePageComponent },
  { path: ':id/edit', component: SurveyEditPageComponent },
  { path: ':id/designer', component: SurveyDesignerPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSurveysRoutingModule { }
