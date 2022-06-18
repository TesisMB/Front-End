import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentMonitoreoComponent } from './recent-monitoreo.component';

describe('RecentMonitoreoComponent', () => {
  let component: RecentMonitoreoComponent;
  let fixture: ComponentFixture<RecentMonitoreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentMonitoreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
