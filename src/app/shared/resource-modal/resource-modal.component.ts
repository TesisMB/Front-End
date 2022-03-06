import { AlertService } from './../../services/_alert.service/alert.service';
import { RequestService } from './../../resources/request/request.service';
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
  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder, private requestService: RequestService, private alertService: AlertService) { }

  ngOnInit(): void {
    console.log('resources =>', this.resources);
    this.form = this.formBuilder.group({
      FK_EmergencyDisasterID: [null,[Validators.required]],
      reason: [null, [Validators.maxLength(153), Validators.required]],
      userRequest: [],
      status:[false, [Validators.required]]
    });
  }

  get f (){ return this.form.controls}
  get reasonError(){return this.form.get('reason').getError('required');}

  requestResponse(status){
     if(this.form.valid){
    this.form.get('FK_EmergencyDisasterID').patchValue(this.resources.emergenciesDisasters.emergencyDisasterID);
    this.form.get('userRequest').patchValue(this.resources.id);
    this.form.get('status').patchValue(status);

    this.requestService.rejectRequest(this.form.value).subscribe(
      data => this.alertService.success('Petición rechazada con exito!'),
      error => this.alertService.error('Ups! Ha ocurrido un error, vuelva a intentarlo mas tarde.')
    );
    this.modal.close();
    status ? this.resources.condition = 'Aceptada': this.resources.condition = 'Rechazada';
   }

}
}
