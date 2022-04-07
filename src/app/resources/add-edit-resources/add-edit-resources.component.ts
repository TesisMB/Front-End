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
import { MatStepper } from '@angular/material/stepper';
import * as _ from 'lodash';
import { compare } from 'fast-json-patch';
// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

const TYPES = [
  {value: 'materiales', viewValue:'Instrumental'},
  {value: 'medicamentos', viewValue:'Farmacia'},
  {value: 'vehiculos', viewValue:'Rodado'}
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
  // providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  // ],
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
loading : boolean = false;
minDate;
maxDate;
vehiclesTypes$: Observable<any>;
vehicleYear: number;
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

    this.formType.statusChanges.subscribe(
      () =>
      {
        this.changeType();
        this.type = this.formType.value;
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

  get materialForm(){ return this.form.get('materials');}
  get medicineForm(){ return this.form.get('medicines');}
  get vehicleForm(){ return this.form.get('vehicles');}
  get isEdit(){return this.action === 'editar'}
  private getParams(){
      this.activatedRoute.paramMap
      .subscribe( params => {
        this.action = params.get('action');
        this.type = params.get('tipo');
        this.createForm();
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
      fk_EstateID: ['',[Validators.required]],
      // picture:['']
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
          medicineExpirationDate: ['11/11/2023',[Validators.required]],
          medicineLab: ['',[Validators.required ]],
          medicineDrug: ['',[Validators.required]],
          medicineWeight: ['',[Validators.required]],
          medicineUnits: ['',[Validators.required]],
          
        }));
      } else if(type ==='vehiculos'){
        this.form.addControl('vehicles', this.formGroup.group({
          vehiclePatent: ['',[Validators.required, Validators.pattern('^[A-Z]{2,3}[ -][0-9]{3}(?: [A-Z]{2})?$')]],
          vehicleYear: [2022,[Validators.required]],
          vehicleUtility: ['',[Validators.maxLength(254)]],
          Fk_EmployeeID: ['',[Validators.required]],
          Fk_TypeVehicleID: ['',[Validators.required]],
          brandsModels: this.formGroup.group({
          Fk_BrandID: ['',[Validators.required]],
          Fk_ModelID: ['',[Validators.required]]
        }),}));
          
        this.vehiclesTypes$ = this.service.vehiclesTypes$;   

        if(!this.isEdit){
        this.form.get('quantity').patchValue(1);
      } 
      
      }
      if(this.isEdit){
        this.formType.setValue(this.type);
        this.form.get('fk_EstateID').clearValidators();
        this.formType.clearValidators();
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

  public onBack(){
    this.location.back();
  }

  private getDateValidations(){
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    this.minDate = new Date(currentYear,currentMonth, currentDate);
    this.maxDate = new Date(currentYear + 10, currentMonth, currentDate);
   // const max = this.maxDate.;
   // console.log(max);
   // console.log(this.minDate);
  }

  dateYear(e, p){
  //  const year2 = +year.substring(12,16);
    // this.vehicleForm.get('vehicleYear').patchValue();
  //  let event = e.toString();
  //  let picker = p;
  //  console.log('Year Date => ', year2);
  //  console.log('Form Date => ',);

  }
  dateChange(e, p){
      let event = e.toString();
      let picker = p;
      console.log('Event Date => ', event);
      console.log('Picker Date => ', picker);
  
    }

}
