import { TestBed, inject } from '@angular/core/testing';

import { ScopeGuardService } from './scope-guard.service';

describe('ScopeGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScopeGuardService]
    });
  });

  it('should ...', inject([ScopeGuardService], (service: ScopeGuardService) => {
    expect(service).toBeTruthy();
  }));
});
