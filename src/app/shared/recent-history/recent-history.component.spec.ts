import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentHistoryComponent } from './recent-history.component';

describe('RecentHistoryComponent', () => {
  let component: RecentHistoryComponent;
  let fixture: ComponentFixture<RecentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
