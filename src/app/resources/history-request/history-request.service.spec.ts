import { TestBed } from '@angular/core/testing';

import { HistoryRequestService } from './history-request.service';

describe('HistoryRequestService', () => {
  let service: HistoryRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
