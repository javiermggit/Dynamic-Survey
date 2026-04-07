import { TestBed } from '@angular/core/testing';

import { SurveySessionStateService } from './survey-session-state.service';

describe('SurveySessionStateService', () => {
  let service: SurveySessionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveySessionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
