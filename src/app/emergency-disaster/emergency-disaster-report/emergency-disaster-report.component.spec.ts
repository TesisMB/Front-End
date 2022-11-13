import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyDisasterReportComponent } from './emergency-disaster-report.component';

describe('EmergencyDisasterReportComponent', () => {
  let component: EmergencyDisasterReportComponent;
  let fixture: ComponentFixture<EmergencyDisasterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyDisasterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyDisasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
