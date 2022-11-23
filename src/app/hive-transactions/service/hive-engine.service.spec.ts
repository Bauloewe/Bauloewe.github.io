import { TestBed } from '@angular/core/testing';

import { HiveEngineService } from './hive-engine.service';

describe('HiveEngineService', () => {
  let service: HiveEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
