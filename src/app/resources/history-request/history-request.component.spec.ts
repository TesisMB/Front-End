import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRequestComponent } from './history-request.component';

describe('HistoryRequestComponent', () => {
  let component: HistoryRequestComponent;
  let fixture: ComponentFixture<HistoryRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
