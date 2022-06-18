import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNoStockComponent } from './recent-no-stock.component';

describe('RecentNoStockComponent', () => {
  let component: RecentNoStockComponent;
  let fixture: ComponentFixture<RecentNoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentNoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentNoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
