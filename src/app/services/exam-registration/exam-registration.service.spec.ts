import { TestBed } from '@angular/core/testing';

import { ExamRegistrationService } from './exam-registration.service';

describe('ExamRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamRegistrationService = TestBed.get(ExamRegistrationService);
    expect(service).toBeTruthy();
  });
});
