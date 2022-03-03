import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdDeleteModalComponent } from './ngbd-delete-modal.component';

describe('NgbdDeleteModalComponent', () => {
  let component: NgbdDeleteModalComponent;
  let fixture: ComponentFixture<NgbdDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
