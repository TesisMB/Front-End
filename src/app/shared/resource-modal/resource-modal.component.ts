import { AlertService } from './../../services/_alert.service/alert.service';
import { RequestService } from './../../resources/request/request.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestGet, ResourcesRequest, ResourcesRequestGet } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class ResourceModalComponent implements OnInit {
@Input() resources: RequestGet;
status: boolean = false;
form: FormGroup;
  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder, private requestService: RequestService, private alertService: AlertService
    ,private authService: AuthenticationService) { }

  ngOnInit(): void {
    console.log('resources =>', this.resources);
    this.form = this.formBuilder.group({
      FK_EmergencyDisasterID: [null],
      Reason: [null, [Validators.maxLength(153), Validators.required]],
      userRequest: [null],
      status:[false, [Validators.required]]
    });
  }
  get isLogistica(){return this.authService.currentUserValue.roleName === 'Encargado de Logistica';}
  get f (){ return this.form.controls}
  get reasonError(){return this.form.get('Reason').getError('required');}

  requestResponse(){
     if(this.form.valid){
    this.form.get('FK_EmergencyDisasterID').patchValue(this.resources.emergenciesDisasters.emergencyDisasterID);
    this.form.get('userRequest').patchValue(this.resources.id);
    this.form.get('status').patchValue(this.status);

    this.requestService.rejectRequest(this.form.value).subscribe(
      data => this.alertService.success(`Petición ${this.status} con exito!`),
      error => this.alertService.error('Ups! Ha ocurrido un error, vuelva a intentarlo mas tarde.')
    );
    this.status ? this.resources.condition = 'Aceptada': this.resources.condition = 'Rechazada';
    this.modal.close();
   }

}

deleteRequest(){
  this.requestService.delete(this.resources.id).subscribe(
    data => {
      this.modal.close();
      this.alertService.success('Solicitud cancelada con exito!', {autoClose: true});
  },
  error => {
    this.alertService.error('Ha ocurrido un error, pruebe mas tarde', {autoClose: true});

  }
  );
}
}
