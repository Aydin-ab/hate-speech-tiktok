import { TestBed } from '@angular/core/testing';

import { RootAuthGuard } from './root-auth.guard';

describe('RootAuthGuard', () => {
  let guard: RootAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RootAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
