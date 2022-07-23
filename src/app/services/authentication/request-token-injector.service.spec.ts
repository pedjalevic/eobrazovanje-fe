import { TestBed } from '@angular/core/testing';

import { RequestTokenInjectorService } from './request-token-injector.service';

describe('RequestTokenInjectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({ }));

  it('should be created', () => {
    const service: RequestTokenInjectorService = TestBed.get(RequestTokenInjectorService);
    expect(service).toBeTruthy();
  });
});
