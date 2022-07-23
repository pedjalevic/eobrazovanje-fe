import { TestBed } from '@angular/core/testing';

import { StudyProgramService } from './study-program.service';

describe('StudyProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudyProgramService = TestBed.get(StudyProgramService);
    expect(service).toBeTruthy();
  });
});
