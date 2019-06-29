import { TestBed } from '@angular/core/testing';

import { BookeepingService } from './bookeeping.service';

describe('BookeepingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookeepingService = TestBed.get(BookeepingService);
    expect(service).toBeTruthy();
  });
});
