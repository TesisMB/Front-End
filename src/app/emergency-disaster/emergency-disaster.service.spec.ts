import { TestBed } from '@angular/core/testing';

import { EmergencyDisasterService } from './emergency-disaster.service';

describe('EmergencyDisasterService', () => {
  let service: EmergencyDisasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyDisasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
