import { TestBed, async, inject } from '@angular/core/testing';

import { VerifyGuard } from './verify.guard';

describe('VerifyGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyGuard]
    });
  });

  it('should ...', inject([VerifyGuard], (guard: VerifyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
