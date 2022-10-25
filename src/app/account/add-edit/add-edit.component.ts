import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {compare } from 'fast-json-patch';
import * as _ from 'lodash';
import { UserService } from './../../users/index';
import {AlertService } from './../../services/index';
import { Employee, User} from 'src/app/models';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

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

  model: User;
  originalUser: User;

  selectedFiles?: FileList;
selectedFileNames: string= "";
progressInfos: any[] = [];
message: string = "";
previews: string = "";
imageInfos?: Observable<any>;

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
      status: [{value: '', disabled: true }, [Validators.required]],
      avatar: [{value: '', disabled: true }],
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
      console.log("originalUser => ", this.originalUser);
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
    .subscribe((x: User) => { 
                this.originalUser = x;
                this.model = _.cloneDeep(this.originalUser);
                this.f.phone.setValue(x.persons.phone);
                this.f.email.setValue(x.persons.email);
                this.f.address.setValue(x.persons.address);
                this.f.status.setValue(x.persons.status);
                this.f.avatar.setValue(x.avatar);

                console.log('Datos: ', x);
      },
                error =>{this.error = error;
                        this.alertService.error('Ha ocurrido un error, porfavor intente más tarde');});
  }

  private updateUser(patch) {
    this.updateHandler =  this.UserService.userUpdate(this.id, patch, this.model)
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
 this.form.get('phone').valueChanges.subscribe(data => this.model.persons.phone = data);
 this.form.get('address').valueChanges.subscribe(data => this.model.persons.address = data);
 this.form.get('password').valueChanges.subscribe(data => this.model.UserPassword = data);
 this.form.get('newPassword').valueChanges.subscribe(data => this.model.UserNewPassword = data);
 this.form.get('email').valueChanges.subscribe(data => this.model.persons.email = data);
this.form.get('status').valueChanges.subscribe(data => this.model.persons.status = data);
this.form.get('avatar').valueChanges.subscribe(data => this.model.avatar = data);
} 

resetForm (): void{
  this.form.reset({
    phone: {value: this.model.persons.phone, disabled: true},
    email: {value: this.model.persons.email, disabled: true},
    password: {value: '', disabled: true},
    newPassword: {value: '', disabled: true},
    passwordRepeat:{value: '', disabled: true},
    address: {value: this.model.persons.address, disabled: true},
    status: {value: this.model.persons.status, disabled: true},
    avatar: {value: this.model.avatar, disabled: true},

  });
  this.form.disable();
}

selectFiles(event: any): void {
  this.message = "";
  this.progressInfos = [];
  this.selectedFileNames = "";
  this.selectedFiles = event.target.files;
//  this.previews = "";
  if (this.selectedFiles && this.selectedFiles[0]) {
    
    const numberOfFiles = this.selectedFiles.length;
    for (let i = 0; i < numberOfFiles; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result);
        this.previews = e.target.result;
      };
      reader.readAsDataURL(this.selectedFiles[i]);
      this.selectedFileNames = this.selectedFiles[i].name;
    }
     this.uploadFiles();
  }
}

uploadFiles(): void {
  this.message = "";
  if (this.selectedFiles) {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }
}

upload(idx: number, file: File): void {
  this.progressInfos[idx] = { value: 0, fileName: file.name };
  if (file) {
    this.UserService.upload(file)
    .subscribe(
      (event: any) => {
       if (event.type === HttpEventType.UploadProgress) {
         this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
       } else if (event instanceof HttpResponse) {
       this.form.get('avatar').patchValue(event.body);
          const msg = 'Se cargó la imagen exitosamente!: ' + file.name;
          this.message = msg;
         this.imageInfos = this.UserService.getFiles();
         }
      },
      (err: any) => {
        this.progressInfos[idx].value = 0;
        const msg = 'No se ha podido cargar la imagen: ' + file.name;
        this.message = msg;
      });
  }
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