import { Vehicle } from './../../models/vehicle.model';
import { AlertService, AuthenticationService } from 'src/app/services';
import {  Employee } from 'src/app/models';
import {  first, map, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ResourcesService } from './../resources.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/users';
import { StatesService } from '../states/states.service';
import * as _ from 'lodash';
import { compare } from 'fast-json-patch';


import { HttpEventType, HttpResponse } from '@angular/common/http';


const TYPES = [
  {value: 'materiales', viewValue:'Instrumental'},
  {value: 'medicamentos', viewValue:'Farmacia'},
  {value: 'vehiculos', viewValue:'Rodado'}
  ];

  const VEHICLES_UTILITYS =['Transporte','Uso particular','Carga', 'Emergencias'];
  const VEHICLES_TYPES = [
  {value: 2, viewValue:'MOTOCICLETA'},
  {value: 1, viewValue:'AUTO'},
  {value: 3, viewValue:'CAMIONETA'},
  {value: 4, viewValue:'CAMION'},
  {value: 5, viewValue:'AMBULANCIA'}
  ];

  const UNITS = [
    {value: 'ml', viewValue:'mililitro (ml)' },
    {value: 'cm3', viewValue:'centímetro cúbico (cm3)' },
    {value: 'mg', viewValue:'miligramo (mg)' },
    {value: 'g', viewValue:'gramo (g)' },
    {value: 'Kg', viewValue:'kilogramo (Kg)' },
    {value: 'dosis', viewValue:'dosis' },
];
  interface UsersInput {
    value: number;
    viewValue: string;
  }
  
  interface UsersGroup {
    disabled?: boolean;
    role: string;
    users: UsersInput[];
  }

@Component({
  selector: 'add-edit-resources',
  templateUrl: './add-edit-resources.component.html',
  styleUrls: ['./add-edit-resources.component.css'],
})
export class addEditResourcesComponent implements OnInit {

id: string = null;
action: string = null;
type: string = null;
form: FormGroup;
cloneForm;
subscription: Subscription;
handleUpdate: Subscription;
locations = [];
estates = [];
userList: UsersGroup[] = [];
currentUser = JSON.parse(localStorage.getItem('currentUser'));
formType : FormControl = new FormControl('',[Validators.required]);
types = TYPES;
units = UNITS;
vehiclesTypes = VEHICLES_TYPES;
vehiclesUtilitys = VEHICLES_UTILITYS;
loading : boolean = false;
minDate;
maxDate;
vehicles: Vehicle = null;

vehicleYear: number;

selectedFiles?: FileList;
selectedFileNames: string= "";
progressInfos: any[] = [];
message: string = "";
previews: string = "";
imageInfos?: Observable<any>;

  constructor(
    private activatedRoute:ActivatedRoute,
    private location: Location,
    private formGroup: FormBuilder,
    private service: ResourcesService,
    private stateService: StatesService,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
    )
    {
   this.getParams();
   this.getQueryParams();

    }

  ngOnInit(): void {
    this.getLocations();
    this.getUsers();
    this.getDateValidations();
    this.formType.statusChanges.subscribe(
      () =>
      {
        this.form.enable();
        this.changeType();
        this.type = this.formType.value;
        this.createForm();
        this.getForm(this.formType.value);

      });
  }

  get getData(){
    return console.log('Form => ',this.form.value);
  }

  get materialForm(){ return this.form.get('materials');}
  get medicineForm(){ return this.form.get('medicines');}
  get vehicleForm(){ return this.form.get('vehicles');}
  get isEdit(){return this.action === 'editar'}

  setPicklist(){ 
    this.vehicleForm.get('fK_EmployeeID').patchValue(this.vehicles.fK_EmployeeID);
    console.log('Ingreso a picklist');
    this.vehicleForm.get('Fk_TypeVehicleID').patchValue(this.vehicles.fk_TypeVehicleID);
}

  private getParams(){
      this.activatedRoute.paramMap
      .subscribe( params => {
        this.action = params.get('action');
        this.type = params.get('tipo');
        this.createForm();
        
        this.getForm(this.type);
        this.form.disable();
      });
    }

  private getQueryParams(){
    this.activatedRoute.queryParamMap
    .subscribe( query => {
      if(query.get('id')){
      this.id = query.get('id');
      this.getItem(this.id);
    }
    });
  }




  private createForm(){
    this.form = this.formGroup.group({
      id:['', [Validators.required]],
      name: ['',[Validators.required, Validators.pattern("[a-zA-Z ]{2,35}"), Validators.maxLength(35)]],
      quantity: ['',[Validators.required, Validators.max(9999), Validators.min(1)]],
      description: ['',[Validators.maxLength(254)]],
      fk_EstateID: [,[Validators.required]],
      donation: [false],
      picture:[],
      createdBy:[],
      modifiedBy:[]
    });

    if(this.isEdit){
      this.form.get('fk_EstateID').clearValidators();
      this.formType.clearValidators();
    }

  }

  private getForm(type: string){

      if(type === 'materiales'){
        this.form.addControl('materials', this.formGroup.group({
          brand: ['',[Validators.required, Validators.maxLength(15)]],
        }));
      } else if(type === 'medicamentos'){
        this.form.addControl('medicines', this.formGroup.group({
          medicineExpirationDate: ['',[Validators.required ,Validators.pattern('^[0-9]{2}[\/][0-9]{4}$') ]],
          medicineLab: ['',[Validators.required ]],
          medicineDrug: ['',[Validators.required]],
          medicineWeight: ['',[Validators.required, Validators.min(1), Validators.max(999)]],
          medicineUnits: ['',[Validators.required]],
          
        }));
      } else if(type ==='vehiculos'){
        this.form.addControl('vehicles', this.formGroup.group({
          vehiclePatent: ['',[Validators.required, Validators.pattern('^[A-Z]{2,3}[ -][0-9]{3}(?: [A-Z]{2})?$')]],
          vehicleYear: ['',[Validators.required, Validators.pattern('^[0-9]{4}$'), Validators.min(1970), Validators.max(2022)]],
          vehicleUtility: ['',[Validators.maxLength(254)]],
          fK_EmployeeID: ['',[Validators.required]],
          Fk_TypeVehicleID: ['',[Validators.required]],
          brandName: ['',[Validators.required, Validators.maxLength(15)]],
          modelName: ['',[Validators.required, Validators.maxLength(15)]]
        }),);
          

        this.form.removeControl('name');
          
      }
      if(this.isEdit){
        this.formType.setValue(this.type);
        this.form.enable();
        this.form.get('fk_EstateID').clearValidators();
        this.formType.clearValidators();
      }
        if(!this.isEdit){
        this.form.get('quantity').patchValue(1);
      } 
  } 

  private getItem(id){
    this.subscription = this.service.getById(id, this.type)
                        .pipe(tap(data => console.log('Item => ', data)))
                        .subscribe(data =>{
                           this.form.patchValue(data);

                           if(this.isEdit){
                           this.form.get('fk_EstateID').patchValue(data.estates.estateID);
                           this.cloneForm = this.form.value;
                           this.vehicles = data.vehicles;
                           this.previews = data.picture;
                           this.form.enable();

                        }
                          });
  }
  private getLocations(){
    this.stateService.getAll(this.currentUser.userID)
    .pipe(map(x => 
    x.filter( estates => this.currentUser.estates.locationCityName == estates.locationCityName)))
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

  private changeType(){
    if(this.form.contains('materials')) this.form.removeControl('materials');
    if(this.form.contains('medicines')) this.form.removeControl('medicines');
    if(this.form.contains('vehicles')) this.form.removeControl('vehicles');
  }

  private getUsers(){
    const arrayUsers: UsersGroup[] = [];
   

    this.userService.getAll(this.currentUser.userID)
    .pipe(
    tap(x => console.log('Usuarios before filter => ', x)),
    map((x:Employee[]) => {

      x.filter( (user: any) =>
       this.currentUser.estates.locationCityName == user.users.estates.locationCityName &&
      user.users.roleName !== 'Admin' && user.users.roleName !== 'Voluntario')
      .forEach(u => {
        const user: any = {};
        user.value = u.employeeID;
        user.viewValue = u.users.persons.firstName + '  '+ u.users.persons.lastName;
        const index = arrayUsers.findIndex(x =>
          x.role === u.users.roleName
        );
          if (index === -1) {
            const users: any = {role: '', users: []};
            users.role = u.users.roleName;
            users.users.push(user);
            arrayUsers.push(users);
          } else {
            arrayUsers[index].users.push(user);
          }
        });
         return arrayUsers;
            }),
    tap(x => console.log('Usuarios after filter => ', x)))
    .subscribe(
      data => {
        this.userList = data;
        if(this.type == 'vehiculos' && this.isEdit){
          this.setPicklist();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  public onSubmit(){
    if(this.form.valid){
      this.loading = true;

      if(this.action === 'nuevo'){

      this.postItem(this.form.value);
    }
      if(this.action === 'editar'){

      this.updateItem();
    }
    }
  }

  private postItem(form){
    this.form.get('createdBy').patchValue(this.authenticationService.currentUserValue.userID);
    form.createdBy =  this.form.get('createdBy').value;
    this.service.register(form,this.formType.value)
    .subscribe(
data => {
  console.log('Post realizado => ', data);
  this.loading = false;
  this.alertService.success(`Recurso registrado con exito!`, {autoClose: true});
  this.form.reset();
  this.form.clearValidators();

},
error => {
    this.loading = false;
    console.log('Error del post => ', error);
    this.alertService.error('Ha ocurrido un error :( , intentelo mas tarde', {autoClose: true});

}
    );
  }

  private updateItem(){
    this.form.get('modifiedBy').patchValue(this.authenticationService.currentUserValue.userID);
    const path = compare(this.cloneForm, this.form.value);
    this.handleUpdate =  this.service.update(this.type, this.id, path )
    .pipe(first())
    .subscribe(
        data => {
            this.alertService.success('Datos actualizado correctamente', { autoClose: true });
            this.loading = false;
            this.onBack();
          },
        error => {
          this.alertService.errorForEmployee(error);
          this.loading = false;
        });
    }

 public onBack(){
    this.location.back();
  }

  private getDateValidations(){
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    this.minDate = new Date(currentYear,currentMonth+1, currentDate);
    this.maxDate = new Date(currentYear + 10, currentMonth, currentDate);
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
        this.service.upload(file)
        .subscribe(
          (event: any) => {
           if (event.type === HttpEventType.UploadProgress) {
             this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
           } else if (event instanceof HttpResponse) {
           this.form.get('picture').patchValue(event.body);
              const msg = 'Se cargó la imagen exitosamente!: ' + file.name;
              this.message = msg;
             this.imageInfos = this.service.getFiles();
             }
          },
          (err: any) => {
            this.progressInfos[idx].value = 0;
            const msg = 'No se ha podido cargar la imagen: ' + file.name;
            this.message = msg;
          });
      }
    }

}
