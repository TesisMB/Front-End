import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyDisasterFilterComponent } from './emergency-disaster-filter.component';

describe('EmergencyDisasterFilterComponent', () => {
  let component: EmergencyDisasterFilterComponent;
  let fixture: ComponentFixture<EmergencyDisasterFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyDisasterFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyDisasterFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
