import { TestBed } from '@angular/core/testing';

import { ExamGradeService } from './exam-grade.service';

describe('ExamGradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({ }));

  it('should be created', () => {
    const service: ExamGradeService = TestBed.get(ExamGradeService);
    expect(service).toBeTruthy();
  });
});
