import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesRequestReportComponent } from './resources-request-report.component';

describe('ResourcesRequestReportComponent', () => {
  let component: ResourcesRequestReportComponent;
  let fixture: ComponentFixture<ResourcesRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
