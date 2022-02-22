import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesDetails } from './resources-details.component';

describe('ResourcesDetails', () => {
  let component: ResourcesDetails;
  let fixture: ComponentFixture<ResourcesDetails>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesDetails ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
