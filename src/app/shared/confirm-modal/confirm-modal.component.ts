import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  constructor(public modal: NgbActiveModal,
             private formBuilder: FormBuilder,
    ) {}

@Input() user: User;
action: string;
reason: string = '';
form: FormGroup;


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      reason: ['', Validators.required]
    })
  }


  get formD () { return this.form;}


  doTextareaValueChange(ev) {
    try {
      this.reason = ev.target.value;
      console.log("Reason", this.reason);
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  closeModal(){
    this.modal.close(this.reason);
  }

}
