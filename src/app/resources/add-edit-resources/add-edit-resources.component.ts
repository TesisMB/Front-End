import { BrandsModels } from './../../models/vehicle.model';
import { AlertService } from 'src/app/services';
import { User, Employee, Resource } from 'src/app/models';
import { filter, first, map, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ResourcesService } from './../resources.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/users';
import { StatesService } from '../states/states.service';
import * as _ from 'lodash';
import { compare } from 'fast-json-patch';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

const moment =  _rollupMoment || _moment;

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const TYPES = [
  {value: 'materiales', viewValue:'Instrumental'},
  {value: 'medicamentos', viewValue:'Farmacia'},
  {value: 'vehiculos', viewValue:'Rodado'}
  ];

  const VEHICLES_UTILITYS =['TRANSPORTE','USO PARTICULAR','CARGA', 'EMERGENCIAS'];
  const VEHICLES_TYPES = [
  {value: '1', viewValue:'MOTOCICLETA'},
  {value: '0', viewValue:'AUTO'},
  {value: '2', viewValue:'CAMIONETA'},
  {value: '3', viewValue:'CAMION'},
  {value: '4', viewValue:'AMBULANCIA'}
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
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class addEditResourcesComponent implements OnInit {

id: number = null;
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
// vehiclesTypes$: Observable<any>;
// vehiclesTypes: any[] = [];
// vehiclesBrands: any[] = [];
vehicleYear: number;

selectedFiles?: FileList;
selectedFileNames: string[] = [];
progressInfos: any[] = [];
message: string[] = [];
previews: string[] = [];
imageInfos?: Observable<any>;

  constructor(
    private activatedRoute:ActivatedRoute,
    private location: Location,
    private formGroup: FormBuilder,
    private service: ResourcesService,
    private stateService: StatesService,
    private userService: UserService,
    private alertService: AlertService
    )
    {
   this.getParams();
   this.getQueryParams();

    }

  ngOnInit(): void {
    this.getLocations();
    this.getUsers();
    this.getDateValidations();
    this.imageInfos = this.service.getFiles();
    // this.vehiclesTypes$ = this.service.vehiclesTypes$;
    // this.getVehiclesTypes();

    this.formType.statusChanges.subscribe(
      () =>
      {
        this.form.enable();
        this.changeType();
        this.type = this.formType.value;
        this.createForm();
        this.getForm(this.formType.value);

      });
    // this.form.get('FK_LocationID').valueChanges.subscribe(value =>{
    //   this.estates = this.locations.filter(x => x.locationID === value);
    //   return console.log('Sucursales => ', this.estates);
    // } );

  }

  get getData(){
    return console.log('Form => ',this.form.value);
  }
  // get typeVehicle(){
  //   const value = this.vehicleForm.get('Fk_TypeVehicleID').value || 0;
  //   const index = this.vehiclesTypes.findIndex(x => x.Fk_TypeVehicleID == value);
  //   if(index == -1){
  //     return 0;
  //   } else {
  //   return index; 
  // }
  // }

  get materialForm(){ return this.form.get('materials');}
  get medicineForm(){ return this.form.get('medicines');}
  get vehicleForm(){ return this.form.get('vehicles');}
  get isEdit(){

    return this.action === 'editar'}

  setPicklist(vehicles){ 
   // this.vehicleForm.get('brandsModels.Fk_ModelID').patchValue(vehicles.Fk_ModelID);
    this.vehicleForm.get('fK_EmployeeID').patchValue(vehicles.fK_EmployeeID);
    //this.vehicleForm.get('brandsModels.Fk_BrandID').patchValue(vehicles.Fk_BrandID);
    //this.vehicleForm.get('Fk_TypeVehicleID').patchValue(vehicles.typeID);
}

  private getParams(){
      this.activatedRoute.paramMap
      .subscribe( params => {
        this.action = params.get('action');
        this.type = params.get('tipo');
        this.createForm();
        this.form.disable();
        this.getForm(this.type);
      });
    }

  private getQueryParams(){
    this.activatedRoute.queryParamMap
    .subscribe( query => {
      if(query.get('id')){
      this.id = +query.get('id');
      this.getItem(this.id);
    }
    });
  }




  private createForm(){
    this.form = this.formGroup.group({
      name: ['',[Validators.required, Validators.pattern("[a-zA-Z ]{2,35}"), Validators.maxLength(35)]],
      quantity: ['',[Validators.required, Validators.max(9999), Validators.min(1)]],
      description: ['',[Validators.maxLength(254)]],
      fk_EstateID: [,[Validators.required]],
      donation: [false],
      imageFile:[]
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
          medicineWeight: ['',[Validators.required,Validators.pattern('^[0-9]{3}$'), Validators.min(1), Validators.max(999)]],
          medicineUnits: ['',[Validators.required]],
          
        }));
      } else if(type ==='vehiculos'){
        this.form.addControl('vehicles', this.formGroup.group({
          vehiclePatent: ['',[Validators.required, Validators.pattern('^[A-Z]{2,3}[ -][0-9]{3}(?: [A-Z]{2})?$')]],
          vehicleYear: ['',[Validators.required, Validators.pattern('^[0-9]{4}$'), Validators.min(1970), Validators.max(2022)]],
          vehicleUtility: ['',[Validators.maxLength(254)]],
          fK_EmployeeID: ['',[Validators.required]],
          Fk_TypeVehicleID: ['',[Validators.required]],
          Fk_BrandID: ['',[Validators.required, Validators.maxLength(15)]],
          Fk_ModelID: ['',[Validators.required, Validators.maxLength(15)]]
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
                           if(this.type == 'vehiculos'){
                            this.setPicklist(data.vehicles);
                          }
                        }
                          });
  }
  private getLocations(){
    this.stateService.getAll()
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
   

    this.userService.getAll()
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

    // getVehiclesTypes(){
    //   this.vehiclesTypes$.subscribe(data => this.vehiclesTypes = data); 
    // }
    // handleChangeTypes(index){
    //   console.log('change => ',this.vehiclesTypes[index].brandModels);
    //   this.vehiclesBrands = this.vehiclesTypes[index].brandModels;
    // }


  public onBack(){
    this.location.back();
  }

  private getDateValidations(){
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    this.minDate = new Date(currentYear,currentMonth+1, currentDate);
    this.maxDate = new Date(currentYear + 10, currentMonth, currentDate);
   // const max = this.maxDate.;
   // console.log(max);
   // console.log(this.minDate);
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.medicineForm.get('medicineExpirationDate').value;
    ctrlValue.year(normalizedYear.year());
    this.medicineForm.get('medicineExpirationDate').patchValue(ctrlValue);  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.medicineForm.get('medicineExpirationDate').value;
    ctrlValue.month(normalizedMonth.month());
    this.medicineForm.get('medicineExpirationDate').patchValue(ctrlValue);  
    datepicker.close();
  }


    selectFiles(event: any): void {
      this.message = [];
      this.progressInfos = [];
      this.selectedFileNames = [];
      this.selectedFiles = event.target.files;
      this.previews = [];
      if (this.selectedFiles && this.selectedFiles[0]) {
        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            console.log(e.target.result);
            this.previews.push(e.target.result);
          };
          reader.readAsDataURL(this.selectedFiles[i]);
          this.selectedFileNames.push(this.selectedFiles[i].name);
        }
      }
    }

    uploadFiles(): void {
      this.message = [];
      if (this.selectedFiles) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload(i, this.selectedFiles[i]);
        }
      }
    }

    upload(idx: number, file: File): void {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
      if (file) {
        this.service.upload(file).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
           //   this.form.get('imageFile').patchValue(file.name);
              const msg = 'Uploaded the file successfully: ' + file.name;
              this.message.push(msg);
              this.imageInfos = this.service.getFiles();
            }
          },
          (err: any) => {
            this.progressInfos[idx].value = 0;
            const msg = 'Could not upload the file: ' + file.name;
            this.message.push(msg);
          });
      }
    }

}
