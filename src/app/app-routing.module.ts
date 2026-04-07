import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'runner',
        pathMatch: 'full'
      },
      {
        path: 'runner',
        loadChildren: () =>
          import('./features/survey-runner/survey-runner.module').then(
            m => m.SurveyRunnerModule
          )
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin-surveys/admin-surveys.module').then(
            m => m.AdminSurveysModule
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'runner'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
