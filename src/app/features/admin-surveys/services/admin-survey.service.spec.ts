import { TestBed } from '@angular/core/testing';

import { AdminSurveyService } from './admin-survey.service';

describe('AdminSurveyService', () => {
  let service: AdminSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
