import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmergencyDisasterComponent } from './add-emergency-disaster.component';

describe('AddEmergencyDisasterComponent', () => {
  let component: AddEmergencyDisasterComponent;
  let fixture: ComponentFixture<AddEmergencyDisasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmergencyDisasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmergencyDisasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
