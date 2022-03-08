import { AlertService } from './../../services/_alert.service/alert.service';
import { RequestService } from './../../resources/request/request.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestGet, ResourcesRequest, ResourcesRequestGet } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';
import { RequestTableService } from 'src/app/resources/request-table/request-table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.css']
})
export class ResourceModalComponent implements OnInit, OnDestroy {
@Input() resources: RequestGet;
status: boolean = false;
form: FormGroup;
handle: Subscription;
handleDelete: Subscription;

  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder, private requestService: RequestService, private alertService: AlertService
    ,private authService: AuthenticationService, private service: RequestTableService) { }

  ngOnInit(): void {
    console.log('resources =>', this.resources);
    this.form = this.formBuilder.group({
      FK_EmergencyDisasterID: [null],
      Reason: [null, [Validators.maxLength(153), Validators.required]],
      userRequest: [null],
      status:[false, [Validators.required]]
    });
  }
  get isLogistica(){return this.authService.currentUserValue.roleName == 'Encargado de Logistica';}
  get f (){ return this.form.controls}
  get reasonError(){return this.form.get('Reason').getError('required');}
  get getCondition(){return this.resources.condition === 'Pendiente';}
  changeStatus(condition:boolean){this.status = condition;}


  requestResponse(){
     if(this.form.valid){
    this.form.get('FK_EmergencyDisasterID').patchValue(this.resources.emergenciesDisasters.emergencyDisasterID);
    this.form.get('userRequest').patchValue(this.resources.users.userID);
    this.form.get('status').patchValue(this.status);

    this.handle = this.requestService.rejectRequest(this.form.value).subscribe(
      data => {
        this.status ? this.resources.condition = 'Aceptada': this.resources.condition = 'Rechazada';
        this.alertService.success(`Petición ${this.resources.condition.toLowerCase()} con exito!`, {autoClose: true});

      },
      error => { 
        if(error == 'Internal server error'){
        this.alertService.error('Ups! Ha ocurrido un error, vuelva a intentarlo mas tarde.', {autoClose: true});
      }
      else{
        this.alertService.error(error.message, {autoClose: true});
      }});
    
    this.modal.close();
   }

}

deleteRequest(){
 this.handleDelete = this.requestService.delete(this.resources.id).subscribe(
    data => {
      this.service.deleteFromTable(this.resources.id);
      this.modal.close();
      this.alertService.success('Solicitud cancelada con exito!', {autoClose: true});
  },
  error => {
    this.alertService.error('Ha ocurrido un error, pruebe mas tarde', {autoClose: true});
    this.modal.close();

  }
  );
}

ngOnDestroy(){
// if(this.handleDelete){
//   this.handleDelete.unsubscribe();
// }
// if(this.handle){
//   this.handle.unsubscribe();
// }
}
}
