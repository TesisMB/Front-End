import { TableService } from 'src/app/services/_table.service/table.service';
import { AlertService } from './../../services/_alert.service/alert.service';
import { Employee } from './../../models/employee';
import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { RoleName } from 'src/app/models';
import {compare } from 'fast-json-patch';
import * as _ from 'lodash';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ngbd-modal-component',
  templateUrl: './ngbd-modal.component.html',
  styleUrls: ['./ngbd-modal.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class NgbdModalComponent implements OnInit, AfterViewInit, OnDestroy {
  submitted: boolean= false;
  loading = false;
  canReset: boolean = true;
  form: FormGroup;
  roles = Object.values(RoleName);
  updateHandler: any;
  deleteHandler: any;
  error: any ="";
  formHandler: any;
  test:any;
  model : Employee;
  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private tableService: TableService,
    public userService: UserService,
    public alertService: AlertService) {
    }
  
    @Input() user: Employee;

    
  ngOnInit() {
    //elimino el valor Voluntario y Admin y deshabilito la opcion de resetear password.
    if(this.user.users.roleName=='Admin'){ 
      this.roles.splice(0,1); 
      this.canReset = true;
    }  
    else {
      this.roles.splice(0,2);
      this.canReset = false
    }

    this.form = this.userService.EmployeeForm;

    const staffs = this.estates;
    // vacio el formArray
    while (staffs.length) {
      staffs.removeAt(0);
    }
    // inserto los valores del usuario al formulario
    this.f.patchValue(this.user);
    // agrego los horarios al formArray
    this.user.users.estates.estatesTimes.forEach(times => staffs.push(this.userService._employeeForm.group(times)));
    //clono al usuario original
    this.model = _.cloneDeep(this.user);
     this.f.disable();
  }

  // getter para acortar el acceso a la variable
  public get f() { return this.form }
 //getter para acortar acceso a horarios laborales
  get estates(): FormArray {
    return this.form.get('users.estates.estatesTimes') as FormArray;
  }
  onSubmit(){

    this.submitted = true;
      // resetea las alertas.
      this.alertService.clear();

      // checkea si el formulario es valido.
      if (this.f.invalid) {
        console.log('form invalido');
          return;
      }
    this.loading = true;

    //Compara los cambios realizados del modelo clonado al principio
    const patch = compare(this.model, this.user);
    (patch.length !== 0) ? this.updateUser(patch) : this.loading = false;
    
  }

  ngAfterViewInit(): void {
    //Subscripcion que captura todos los cambios realizados en el formulario
    // y los guarda en el usuario
    this.formHandler = this.f.valueChanges
    .subscribe((change: Employee) => 
      {
      this.user = change;      
    },
    error => {
      this.error = error;
      console.log(error);
    });
  }


  onClick(){
    //metodo que habilita y deshabilita el formulario, se ejecuta al clickear en el boton Actualizar Datos
    (this.form.disabled)?this.form.enable():this.form.disable(); 
  }

  private updateUser(patch) {
  
    this.updateHandler =  this.userService.userUpdate(this.user.employeeID, patch, this.user.users )
          .pipe()
          .subscribe(
              () => {
      this.alertService.success('Datos actualizado correctamente', { autoClose: true });
      this.tableService._setEmployee(this.user);
      this.model = _.cloneDeep(this.user);
      this.form.disable();
      this.loading = false;
              },
              error => {
                  this.alertService.errorForEmployee(error);
                  this.loading = false;
              });
  }

  changeStatus(reason: string){  
    this.loading = true;
    //Se abre el modal de confirmacion.
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.user = this.model.users;
    modalRef.componentInstance.action = reason;
  
    modalRef.result.then(
      ()=> {
        if (reason ==='Eliminar'){
            this.deleteUser(this.model.employeeID);
  }
    else {
    (this.model.users.userAvailability) ? this.f.get('users.userAvailability').setValue(false) : this.f.get('users.userAvailability').setValue(true);
    const patch = compare(this.model, this.user);
    (patch.length !== 0) ? this.updateUser(patch) : this.loading = false;
    }
    
      
    },
    cancel =>{ 
      this.loading = false;
      console.log('Acción cancelada con: ' + cancel);
    }); 
  }

  deleteUser(id) {
    this.deleteHandler = this.userService.delete(id)
    .subscribe(
    () =>{
      this.alertService.success('Usuario eliminado exitosamente', { autoClose: true });
    },
    error => {
      this.alertService.warn('Ha ocurrido un error', { autoClose: true });
      this.error = error;
      console.log(error);
    }
  );

  }
 
ngOnDestroy(){
  this.formHandler.unsubscribe();
  if(this.updateHandler){
    this.updateHandler.unsubscribe();
  }
  if(this.deleteHandler){
    this.deleteHandler.unsubscribe();
  }
}
}
