import { TestBed } from '@angular/core/testing';

import { RequestTableService } from './request-table.service';

describe('RequestTableService', () => {
  let service: RequestTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
