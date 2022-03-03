import { TestBed } from '@angular/core/testing';

import { ResourcesDetailsService } from '../cart/cart.service';

describe('ResourcesDetailsService', () => {
  let service: ResourcesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
