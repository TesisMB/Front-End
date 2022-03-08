import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyDisasterComponent } from './emergency-disaster.component';

describe('EmergencyDisasterComponent', () => {
  let component: EmergencyDisasterComponent;
  let fixture: ComponentFixture<EmergencyDisasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyDisasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyDisasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
