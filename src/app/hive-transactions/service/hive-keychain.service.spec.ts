import { TestBed } from '@angular/core/testing';

import { HiveKeychainService } from './hive-keychain.service';

describe('HiveKeychainService', () => {
  let service: HiveKeychainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveKeychainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
