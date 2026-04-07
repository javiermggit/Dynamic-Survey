import { TestBed } from '@angular/core/testing';

import { SurveyRunnerService } from './survey-runner.service';

describe('SurveyRunnerService', () => {
  let service: SurveyRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
