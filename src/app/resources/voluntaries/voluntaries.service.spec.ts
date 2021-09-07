import { TestBed } from '@angular/core/testing';

import { VoluntariesService } from './voluntaries.service';

describe('VoluntariesService', () => {
  let service: VoluntariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoluntariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
