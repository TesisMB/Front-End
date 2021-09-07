import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutResourcesComponent } from './layout-resources.component';

describe('LayoutResourcesComponent', () => {
  let component: LayoutResourcesComponent;
  let fixture: ComponentFixture<LayoutResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
