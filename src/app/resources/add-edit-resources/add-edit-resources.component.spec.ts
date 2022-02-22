import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { addEditResourcesComponent } from './add-edit-resources.component';

describe('addEditResourcesComponent', () => {
  let component: addEditResourcesComponent;
  let fixture: ComponentFixture<addEditResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ addEditResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(addEditResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
