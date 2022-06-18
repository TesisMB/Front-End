import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAlertComponent } from './recent-alert.component';

describe('RecentAlertComponent', () => {
  let component: RecentAlertComponent;
  let fixture: ComponentFixture<RecentAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
