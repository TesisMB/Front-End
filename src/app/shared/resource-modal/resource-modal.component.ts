import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestGet, ResourcesRequest, ResourcesRequestGet } from 'src/app/models';

@Component({
  selector: 'resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class ResourceModalComponent implements OnInit {
@Input() resources: RequestGet;
form: FormGroup;
  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('resources =>', this.resources);
    this.form = this.formBuilder.group({
      Reason: [null, [Validators.maxLength(153), Validators.required]],

    });
  }

  get f (){ return this.form.controls}
  get reasonError(){return this.form.get('Reason').getError('required');}

  rejectRequest(){
    if(this.form.valid){
    this.modal.dismiss('Solicitud cancelada');
    this.resources.condition = 'Rechazada';
  }
}

}
