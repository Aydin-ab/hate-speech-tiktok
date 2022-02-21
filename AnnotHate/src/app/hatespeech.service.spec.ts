import { TestBed } from '@angular/core/testing';

import { HatespeechService } from './hatespeech.service';

describe('HatespeechService', () => {
  let service: HatespeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatespeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
