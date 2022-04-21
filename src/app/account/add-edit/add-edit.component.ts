import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {compare } from 'fast-json-patch';
import * as _ from 'lodash';

import { UserService } from './../../users/index';
import {AlertService } from './../../services/index';
import { Employee} from 'src/app/models';

@Component({
  selector: 'add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  id: number;
 
  updateHandler: any;
  getHandler: any;
  error: any ="";

  loading = false;
  submitted = false;

  model: Employee;
  originalUser: Employee;


  constructor(
      private formBuilder: FormBuilder,
      public UserService: UserService,
      private alertService: AlertService,
      private authenticationService: AuthenticationService
  ) {
   
    this.id = this.authenticationService.currentUserValue.userID;

  }
  ngOnInit() {

    this.getInfo();

      this.form = this.formBuilder.group({
      phone:    [{value: '', disabled: true },[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email:    [{value: '', disabled: true },[Validators.required,Validators.email]],
      address: [{value: '', disabled: true },[Validators.required,Validators.pattern, Validators.maxLength(25)]],
      password: [{value: '', disabled: true },[Validators.minLength(8), Validators.maxLength(16)]],
      newPassword: [{value: '', disabled: true },[Validators.minLength(8), Validators.maxLength(16)]],
      passwordRepeat: [{value: '', disabled: true },[Validators.minLength(8), Validators.maxLength(16)]],
      status: [{value: '', disabled: true }, [Validators.required]]
      });
           
     
  }

  // getter para acortar el acceso a la variable
  get f() { return this.form.controls; }

  onUpdate(user) {
    console.log(user);
      if (this.form.disabled){
      this.form.enable();
      this.model = _.cloneDeep(user);
      this.originalUser = user;
    }
      else {
          this.form.disable();
      }
    
  }

  onSubmit() {

      this.submitted = true;
      // resetea las alertas.
      this.alertService.clear();

      // checkea si el formulario es valido.
      if (this.form.invalid) {
          return;
      }
    this.loading = true;

    const patch = compare(this.originalUser, this.model);  
    console.log('Patch: '+patch);
    if(this.passwordMatchValidator() && patch.length !== 0){
           this.updateUser(patch);

    }
    else this.alertService.warn('No se han efectuado los cambios');
      }

   private getInfo() {
    this.getHandler = this.UserService.getById(this.id)
    .pipe(first())
    .subscribe((x: Employee) => { 
                this.originalUser = x;
                this.model = _.cloneDeep(this.originalUser);
                this.f.phone.setValue(x.users.persons.phone);
                this.f.email.setValue(x.users.persons.email);
                this.f.address.setValue(x.users.persons.address);
                this.f.status.setValue(x.users.persons.status);

                console.log('Datos: ', x);
      },
                error =>{this.error = error;
                        this.alertService.error('Ha ocurrido un error, porfavor intente más tarde');});
  }

  private updateUser(patch) {
    this.updateHandler =  this.UserService.userUpdate(this.id, patch, this.model.users )
          .pipe(first())
          .subscribe(
              data => {
                  this.alertService.success('Datos actualizado correctamente', { autoClose: true });
                  this.resetForm();
                  this.loading = false;
              },
              error => {
                this.alertService.errorForEmployee(error);
                this.loading = false;
              });
  }

  ngAfterViewInit(): void {
 this.form.get('phone').valueChanges.subscribe(data => this.model.users.persons.phone = data);
 this.form.get('address').valueChanges.subscribe(data => this.model.users.persons.address = data);
 this.form.get('password').valueChanges.subscribe(data => this.model.users.UserPassword = data);
 this.form.get('newPassword').valueChanges.subscribe(data => this.model.users.UserNewPassword = data);
 this.form.get('email').valueChanges.subscribe(data => this.model.users.persons.email = data);
this.form.get('status').valueChanges.subscribe(data => this.model.users.persons.status = data);
} 

resetForm (): void{
  this.form.reset({
    phone: {value: this.model.users.persons.phone, disabled: true},
    email: {value: this.model.users.persons.email, disabled: true},
    password: {value: '', disabled: true},
    newPassword: {value: '', disabled: true},
    passwordRepeat:{value: '', disabled: true},
    address: {value: this.model.users.persons.address, disabled: true},
    status: {value: this.model.users.persons.status, disabled: true}

  });
  this.form.disable();
}

passwordMatchValidator(): boolean {
  let result;
      result = this.form.get('newPassword').value === this.form.get('passwordRepeat').value
     ? this.f.newPassword.valid : (this.f.newPassword.invalid, this.alertService.warn('Las contraseñas deben ser iguales'));
     console.log('Password iguales?: '+result);
     return result;
}

  ngOnDestroy(){
      this.getHandler.unsubscribe();
      if(this.updateHandler){
      this.updateHandler.unsubscribe();
      }
  }
}
