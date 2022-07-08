import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorioListComponent } from './monitorio-list.component';

describe('MonitorioListComponent', () => {
  let component: MonitorioListComponent;
  let fixture: ComponentFixture<MonitorioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
