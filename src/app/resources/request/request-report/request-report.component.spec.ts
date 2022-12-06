import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReportComponent } from './request-report.component';

describe('RequestReportComponent', () => {
  let component: RequestReportComponent;
  let fixture: ComponentFixture<RequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
