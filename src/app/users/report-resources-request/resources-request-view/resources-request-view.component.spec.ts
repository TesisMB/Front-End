import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesRequestViewComponent } from './resources-request-view.component';

describe('ResourcesRequestViewComponent', () => {
  let component: ResourcesRequestViewComponent;
  let fixture: ComponentFixture<ResourcesRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
