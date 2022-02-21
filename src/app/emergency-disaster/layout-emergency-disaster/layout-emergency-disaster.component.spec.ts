import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster.component';

describe('LayoutEmergencyDisasterComponent', () => {
  let component: LayoutEmergencyDisasterComponent;
  let fixture: ComponentFixture<LayoutEmergencyDisasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutEmergencyDisasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutEmergencyDisasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
