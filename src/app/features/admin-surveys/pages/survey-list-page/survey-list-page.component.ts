import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AdminSurveySummary } from '../../models/admin-survey.models';
import { AdminSurveyService } from '../../services/admin-survey.service';

@Component({
  selector: 'app-survey-list-page',
  templateUrl: './survey-list-page.component.html',
  styleUrls: ['./survey-list-page.component.css']
})
export class SurveyListPageComponent implements OnInit {
  readonly supportsSurveyList = environment.useMocks || environment.supportsAdminSurveyList;
  surveys: AdminSurveySummary[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminSurveyService: AdminSurveyService) {}

  getStatusLabel(status: AdminSurveySummary['status']): string {
    if (status === 'Published') {
      return 'Publicada';
    }

    if (status === 'Archived') {
      return 'Archivada';
    }

    return 'Borrador';
  }

  ngOnInit(): void {
    if (!this.supportsSurveyList) {
      this.errorMessage =
        'Tu API actual no publica GET /api/admin/surveys. Puedes crear encuestas y entrar al designer, pero el listado quedara disponible cuando agregues ese endpoint.';
      return;
    }

    this.loading = true;

    this.adminSurveyService.getSurveys().subscribe({
      next: surveys => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No fue posible cargar las encuestas.';
      }
    });
  }
}
