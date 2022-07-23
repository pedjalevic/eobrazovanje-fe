import { TestBed } from '@angular/core/testing';

import { EngagementsService } from './engagements.service';

describe('EngagementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EngagementsService = TestBed.get(EngagementsService);
    expect(service).toBeTruthy();
  });
});
