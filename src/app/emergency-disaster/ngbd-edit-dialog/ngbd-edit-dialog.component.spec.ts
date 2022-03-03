import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdEditDialogComponent } from './ngbd-edit-dialog.component';

describe('NgbdEditDialogComponent', () => {
  let component: NgbdEditDialogComponent;
  let fixture: ComponentFixture<NgbdEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
