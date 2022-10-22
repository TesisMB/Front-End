import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { TableService } from 'src/app/services/_table.service/table.service';
import { AlertService } from './../../services/_alert.service/alert.service';
import { Employee } from './../../models/employee';
import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Role, User} from 'src/app/models';
import {compare } from 'fast-json-patch';
import * as _ from 'lodash';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';
import { StatesService } from 'src/app/resources/states/states.service';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface UsersInput {
  value: number;
  viewValue: string;
}

interface UsersGroup {
  disabled?: boolean;
  id: number;
  users: Employee[];
}
const ACTIVE = 'Activa';
const INACTIVE = 'Inactiva';

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

  model : User;
  roles: Role[];
  locations = [];
  estates = [];

  constructor(
    // public dialogRef: MatDialogRef<NgbdModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private tableService: TableService,
    private userService: UserService,
    private alertService: AlertService,
    private stateService: StatesService,
    private authenticationService: AuthenticationService ) {
    }
  
    @Input() user: User = null;

    
  ngOnInit() {

    //elimino el valor Voluntario y Admin y deshabilito la opcion de resetear password.
    
    if(this.user.roleName=='Admin'){ 
      //this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario');
      this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !== 'Voluntario');
      this.canReset = true;
    }  
    else if(this.user.roleName=='Voluntario'){
      this.roles = this.userService.listarRoles.filter(roles => roles.RoleName === 'Voluntario');
      this.canReset = true;
    }
    else {
      //this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario' && 'Admin');
      this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario' && roles.RoleName !== 'Admin');
      this.canReset = false
    }
    //Se le asigna el modelo de formulario.
    this.form = this.userService.EmployeeForm;

    const staffs = this.estate;
    // vacio el formArray
    while (staffs.length) {
      staffs.removeAt(0);
    }
    console.log('Datos de usuario => ', this.user);
    //Se obtiene el role y se le asigna al formulario el ID de dicho rol.
    let id =(this.roles.find(name => name.RoleName === this.user.roleName));
    // inserto el FK_RoleID en el objeto user
    this.user.FK_RoleID = id.roleID;
    this.user.FK_EstateID = this.user.estates.estateID;

    // inserto los valores del usuario al formulario
    this.f.patchValue(this.user);
    console.log('Datos de form => ', this.f);

    // agrego los horarios al formArray
    this.user.estates.estatesTimes.forEach(times => staffs.push(this.userService._employeeForm.group(times)));
    
    //clono al usuario original
    this.model = _.cloneDeep(this.user);

    // Se deshabilita el formulario
     this.f.disable();


    //Subscriber a localidades y sucursales.
     this.getLocations();
  }

  // getter para acortar el acceso a la variable
  public get f() { return this.form }
 //getter para acortar acceso a horarios laborales
  get estate(): FormArray { return this.form.get('estates.estatesTimes') as FormArray; }

  get roleID(){ return this.form.get('FK_RoleID') }

  get roleName(){ return this.form.get('roleName') }

  get isAdmin(){
    return this.authenticationService.currentUserValue.roleName ===  'Admin';
  }
  get isCGeneral(){
    return  this.authenticationService.currentUserValue.roleName ===  'Coordinador General';
  }

  get isNotVolunteer(){
    return this.authenticationService.currentUserValue.roleName !==  'Voluntario';
  }

  get isVolunteer(){
    return this.authenticationService.currentUserValue.roleName ===  'Voluntario';
  }

  get isMe(){
    return  this.authenticationService.currentUserValue.userID ===  this.user.userID;
  }

  get getActiveList(){
    const activeList = this.user.emergencyDisastersReports.filter(p => p.state === ACTIVE);
    return activeList;
  }

  get getInactiveList(){
    const inactiveList = this.user.emergencyDisastersReports.filter(p => p.state === INACTIVE);
    return inactiveList;
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
    .subscribe((change: User) => 
      {
      this.user = change;
    },
    error => {
      this.error = error;
      console.log(error);
    });

    console.log('isAdmin ? => ', this.isAdmin);

  }

  onNoClick(): void {
    // this.dialogRef.close();
  } 
  onClick(){
    //metodo que habilita y deshabilita el formulario, se ejecuta al clickear en el boton Actualizar Datos
    (this.form.disabled)?this.form.enable():this.form.disable();
    // if(this.user.roleName ==='Voluntario'){    
    //   this.f.controls['roleName'].disable();
      // }
  }

  private updateUser(patch) {
  
    this.updateHandler =  this.userService.userUpdate(this.user.userID, patch, this.user )
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
    modalRef.componentInstance.user = this.model;
    modalRef.componentInstance.action = reason;
  
    modalRef.result.then(
      ()=> {
        if (reason ==='Eliminar'){
            this.deleteUser(this.model.userID);
  }
    else {
    (this.model.userAvailability) ? this.f.get('userAvailability').setValue(false) : this.f.get('userAvailability').setValue(true);
      this.patch();
  }},
    cancel =>{ 
      this.loading = false;
      console.log('Acción cancelada con: ' + cancel);
    }); 
  }

  patch(){
    let patch = compare(this.model, this.user);

    patch = patch.filter( obj => obj.path !== "/roleName");
    patch = patch.filter( obj => obj.path !== "/avatar");
    patch = patch.filter( obj => obj.path !== "/createdDate");
    patch = patch.filter( obj => obj.path !== "/createdate");
    patch = patch.filter( obj => obj.path !== "/fK_EstateID");
    patch = patch.filter( obj => obj.path !== "/fK_RoleID");
    patch = patch.filter( obj => obj.path !== "/emergencyDisastersReports");
    
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


    //*************REFACTORIZAR ************/
  generatePDF(role){ 
    if(role == true){
      this.generateEmployeePDF();
    }else{
      this.generateVolunteerPDF();
    }
  }
  
    //*************REFACTORIZAR ************/

  generateEmployeePDF(){  
     //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
     let fileName = `${this.user.persons.firstName} ${this.user.persons.lastName}`;
     this.userService.generatePDF(this.user.userID).subscribe(res => {
       const file = new Blob([<any>res], {type: 'application/pdf'});
     //  saveAs(file, fileName);
       const fileURL = window.URL.createObjectURL(file);
       window.open(fileURL, fileName);
     });
    }

        //*************REFACTORIZAR ************/

 generateVolunteerPDF(){ 

  //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
    //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
    let fileName = 'Voluntario';
    this.userService.generatePDFVolunteer(this.user.userID).subscribe(res => {
      const file = new Blob([<any>res], {type: 'application/pdf'});
    //  saveAs(file, fileName);
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, fileName);
    });
  }



  
  resetPassword(){
    const e = {email: this.user.persons.email}
    this.resetHandler = this.authenticationService.sendEmail(e)
                        .subscribe(
                          () => {
                            this.alertService.success('Contraseña reseteada, por favor verifique su correo electronico.', {autoClose : true})
                          },
                          error => {this.error = error;
                                    this.alertService.error('Ha ocurrido un error, porfavor intentar más tarde.',{autoClose: true});}
                          );}


   private getLocations(){
     this.stateService.getAll()
     .pipe(map(x => 
     x.filter( estates => this.user.estates.locationCityName == estates.locationCityName)))
     .subscribe(
       data => {
         this.locations = data;
         data.forEach(e => {
           this.estates.push(e.estates);
         });
         console.log(data);
         console.log(this.estates);
  
       },
       error => {
         console.log(error);
       }
     )
   }

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