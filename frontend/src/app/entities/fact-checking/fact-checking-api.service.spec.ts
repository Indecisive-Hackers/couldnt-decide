import { TestBed } from '@angular/core/testing';

import { FactCheckingApiService } from './fact-checking-api.service';

describe('FactCheckingApiService', () => {
  let service: FactCheckingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactCheckingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
