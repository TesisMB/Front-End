import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { TableService } from 'src/app/services/_table.service/table.service';
import { AlertService } from './../../services/_alert.service/alert.service';
import { Employee } from './../../models/employee';
import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Role} from 'src/app/models';
import {compare } from 'fast-json-patch';
import * as _ from 'lodash';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';

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
  
  updateHandler: any;
  deleteHandler: any;
  formHandler: any;
  resetHandler: any;
  error: any ="";

  model : Employee;
  roles: Role[];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private tableService: TableService,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService ) {
    }
  
    @Input() user: Employee;

    
  ngOnInit() {

    //elimino el valor Voluntario y Admin y deshabilito la opcion de resetear password.
    if(this.user.users.roleName=='Admin'){ 
      this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario');
      this.canReset = true;
    }  
    else {
      this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario' && 'Admin');
      this.canReset = false
    }
    //Se le asigna el modelo de formulario.
    this.form = this.userService.EmployeeForm;

    const staffs = this.estates;
    // vacio el formArray
    while (staffs.length) {
      staffs.removeAt(0);
    }
    console.log('Datos de usuario: ', this.user);
    //Se obtiene el role y se le asigna al formulario el ID de dicho rol.
    let id =(this.roles.find(name => name.RoleName === this.user.users.roleName));
    // inserto el FK_RoleID en el objeto user
    this.user.users.FK_RoleID = id.roleID;
    this.user.users.FK_EstateID = this.user.users.estates.estateID;

    // inserto los valores del usuario al formulario
    this.f.patchValue(this.user);

    // agrego los horarios al formArray
    this.user.users.estates.estatesTimes.forEach(times => staffs.push(this.userService._employeeForm.group(times)));
    //clono al usuario original
    this.model = _.cloneDeep(this.user);

    // Se deshabilita el formulario
     this.f.disable();
  }

  // getter para acortar el acceso a la variable
  public get f() { return this.form }
 //getter para acortar acceso a horarios laborales
  get estates(): FormArray { return this.form.get('users.estates.estatesTimes') as FormArray; }

  get roleID(){ return this.form.get('users.FK_RoleID') }

  get roleName(){ return this.form.get('users.roleName') }

  get isAdmin(){
    return this.authenticationService.currentUserValue.roleName ===  'Admin';
  }
  get isCGeneral(){
    return  this.authenticationService.currentUserValue.roleName ===  'Coordinador General';
  }

  get isMe(){
    return  this.authenticationService.currentUserValue.userID ===  this.user.users.userID;
  }

  setRole(){
  let role = (this.roles.find(name => name.RoleName === this.roleName.value));
  this.roleID.patchValue(role.roleID);

  }

  onSubmit(){

    this.submitted = true;
      // resetea las alertas.
    this.alertService.clear();

      // checkea si el formulario es valido.
      if (this.f.invalid) {
        console.log('form invalido');
          return;}
    
    this.loading = true;

    //Compara los cambios realizados del modelo clonado al principio
    this.patch();
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

    console.log('isAdmin ? => ', this.isAdmin);

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
            this.deleteUser(this.model.users.userID);
  }
    else {
    (this.model.users.userAvailability) ? this.f.get('users.userAvailability').setValue(false) : this.f.get('users.userAvailability').setValue(true);
      this.patch();
  }},
    cancel =>{ 
      this.loading = false;
      console.log('Acción cancelada con: ' + cancel);
    }); 
  }

  patch(){
    let patch = compare(this.model, this.user);

    patch = patch.filter( obj => obj.path !== "/users/roleName");
    console.log(patch);

    (patch.length !== 0) ? this.updateUser(patch) : this.loading = false;

  }

  deleteUser(id) {
    this.deleteHandler = this.userService.delete(id)
    .subscribe(
    () =>{
      this.alertService.success('Usuario eliminado exitosamente', { autoClose: true });
      this.tableService.deleteFromTable(id);
      this.activeModal.close();
    },
    error => {
      this.alertService.warn('Ha ocurrido un error', { autoClose: true });
      this.error = error;
      console.log(error);
      this.activeModal.close();
    }
  );}

  generatePDF(){ 
    let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
    this.userService.generatePDF(this.user.employeeID).subscribe(res => {
      const file = new Blob([<any>res], {type: 'application/pdf'});
    //  saveAs(file, fileName);
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL);
    });
  }
  
  resetPassword(){
    const e = {email: this.user.users.persons.email}
    this.resetHandler = this.authenticationService.sendEmail(e)
                        .subscribe(
                          () => {
                            this.alertService.success('Contraseña reseteada, por favor verifique su correo electronico.', {autoClose : true})
                          },
                          error => {this.error = error;
                                    this.alertService.error('Ha ocurrido un error, porfavor intentar más tarde.',{autoClose: true});}
                          );}
ngOnDestroy(){
  this.formHandler.unsubscribe();
  if(this.updateHandler){
    this.updateHandler.unsubscribe();
  }
  if(this.deleteHandler){
    this.deleteHandler.unsubscribe();
  }
  if(this.resetHandler){
    this.resetHandler.unsubscribe();
}
}
}