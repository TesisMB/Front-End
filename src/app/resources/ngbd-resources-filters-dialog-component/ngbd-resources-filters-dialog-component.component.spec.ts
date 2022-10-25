import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdResourcesFiltersDialogComponentComponent } from './ngbd-resources-filters-dialog-component.component';

describe('NgbdResourcesFiltersDialogComponentComponent', () => {
  let component: NgbdResourcesFiltersDialogComponentComponent;
  let fixture: ComponentFixture<NgbdResourcesFiltersDialogComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdResourcesFiltersDialogComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdResourcesFiltersDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
