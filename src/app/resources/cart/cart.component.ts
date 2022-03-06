import { EmergencyDisasterService } from './../../emergency-disaster/emergency-disaster.service';
import { AlertService } from './../../services/_alert.service/alert.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourcesDetailsService } from './cart.service';
import { Cart } from 'src/app/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';


interface EmergenciesInput {
  value: number;
  viewValue: string;
  date?: Date;
}

interface Emergencies {
  disabled?: boolean;
  name: string;
  emergency: EmergenciesInput[];
}

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  emergencyControl = new FormControl();
  emergencyGroups: Emergencies[] = [];

  request: Cart = null;
  error:any;
  handle: any;
  form: FormGroup;
  loading: boolean = false;
  cloneRequest: Cart = null;
  emergencies: any = {};
  handleEmergency: any;

  constructor( 
    private requestService: ResourcesDetailsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _snackBar: MatSnackBar,
    private emergenciesService: EmergencyDisasterService
) {
  this.getRequest();
  this.getEmergencies();
 }

    ngOnInit(): void {
      console.log('request: ', this.request);
      console.log('cloneRequest: ', this.cloneRequest);
     // console.log('form: ', this.form.value);

  }

  get f() {return this.form.controls;}
  get array() { return this.form.get('resources_RequestResources_Materials_Medicines_Vehicles') as FormArray ;}
  get isRequest(){
      if(this.request){
        return this.request.request.length > 0 ? true : false;
      }else {
        return false;
      }
      }

  get getStyle() { return this.request.request.length >= 2 ? '230px' : 'max-content';}
   get reasonForm(){return this.form.get('Description').getError('required');}
   get EmergencyIDForm(){return this.form.get('FK_EmergencyDisasterID').getError('required');}

 // get getRes(){ return this.form.}

  onSubmit(){
    if(this.form.valid){
    const submitData = this.form.value;
    this.isLoading();
    console.log('Datos pre-post: ', submitData);
   this.postCart(submitData);
  }
}

createForm() {
  this.form = this.formBuilder.group({
    Description: [null, [Validators.maxLength(153)]],
    FK_EmergencyDisasterID: ['Seleccione una emergencia',[Validators.required, Validators.pattern("^[0-9]*$")]],
    resources_RequestResources_Materials_Medicines_Vehicles: this.formBuilder.array(
    this.request.request.map(item => this.createRequest(item)))
  });
}

  getRequest(){
    this.isLoading();

    this.handle = this.requestService._request
    .subscribe(
      items => {
        this.request = items;
        this.cloneRequest = JSON.parse(JSON.stringify(this.request));
        this.error = undefined;
        this.loading = false;
        if(items){
        this.createForm();
        }
      },
      error => {
       // this.isLoading();
        this.alertService.error('Ha ocurrido un error :(, intente mas tarde', { autoClose: true });

      });
      }

  deleteFromCart(index:number){
  this.requestService.deleteFromCart(index);
  let arrayDelete = this.array.removeAt(index);

}

  isLoading(){
  this.loading =!this.loading;
  return this.loading;
  }
    clearCart(){
    this.requestService.clearCartRequest();
  }

  postCart(f){
    this.requestService.postRequest(f)
   .subscribe(
     data => {

     // this.alertService.success('Solicitud enviada correctamente :)', {autoClose: true });
      this._snackBar.open('Solicitud enviada correctamente :)','Cerrar', {
        horizontalPosition:'center',
        verticalPosition: 'top',
        duration: 2000,
      });
      this.isLoading();
      this.clearCart();
      },
     error =>{
    this.error = error;
    console.log('Error => ', error);
    
    this.setMessageError(this.error);
  
    //console.log('Error del post: ', error);
    this.isLoading();
  } );
  }
  getErrorMessage(value, max) {
    if(value <= 0)  {
      return 'La cantidad minima para solicitar es 1.';
    }  else if(value > max) {
      return ('La cantidad maxima de stock disponible es '+ max);
    }

  }

  getStock(index){
    (this.request.request[index].resource.quantity + this.request.request[index].quantity) <= 0
  }
  createRequest(item): FormGroup {
     //   FK_VolunteersID: null
    const  maxQuantity = item.resource.quantity + item.quantity;

    if(maxQuantity > 0) {
      if(item.resource.materials){
        return this.formBuilder.group({
          FK_MaterialID: [item.resource.id],
          quantity: [item.quantity,[Validators.max(100), Validators.min(1)]],
        });

      }else if(item.resource.medicines){
        return this.formBuilder.group({
          FK_MedicineID : [item.resource.id],
          quantity: [item.quantity,[Validators.max(maxQuantity), Validators.min(1)]],
        });

      }else if(item.resource.vehicles){
        return this.formBuilder.group({
          FK_VehiclesID: [item.resource.id],
          quantity: [item.quantity,[Validators.max(maxQuantity), Validators.min(1)]],
        });

     }else if(item.resource.volunteers){
    //  resp.FK_VolunteersID = item.resource.id
      }
    }
    else {
      console.log('Entro por el else: ', item);
      return this.formBuilder.group({
        FK_MaterialID: [{value: null, disabled: true }],
        quantity: [{value: null, disabled: true }],
      });
    }
    }


  getMax(i){
  const max =   this.request.request[i].resource.quantity + this.request.request[i].quantity;
    return  max;
  }

  getEmergencies(){
    const arrayEmergencies: Emergencies[] = [];

    this.handleEmergency = this.emergenciesService.getAll()
    .pipe(
      map( x =>{
        console.log('Emergencias =>', x)

      x.forEach(e => {
      const emergency: any = {};
      emergency.value = e.emergencyDisasterID;
      emergency.viewValue = e.locations.locationMunicipalityName + ' - '+ e.locations.locationDepartmentName;
      emergency.date = e.emergencyDisasterStartDate;
      const index = arrayEmergencies.findIndex(x =>
        x.name === e.typesEmergenciesDisasters.typeEmergencyDisasterName
      );
        if (index === -1) {
          const emergencies: any = {name: '', emergency: []};
          emergencies.name = e.typesEmergenciesDisasters.typeEmergencyDisasterName;
          emergencies.emergency.push(emergency);
          arrayEmergencies.push(emergencies);
        } else {
          arrayEmergencies[index].emergency.push(emergency);
        }
      });
       return arrayEmergencies;
    }))
    .subscribe(data =>{
      console.log('data: ',data);
      this.emergencyGroups = data;
    } );
  }

  setMessageError(error){
    if(error == 'Internal server error'){
    this.alertService.error('Error en el envìo de la solicitud, por favor intentar màs tarde.', { autoClose: true });

    }
    else {
    this.request.request.forEach(x =>
      {
        error.forEach(err => {
          if(x.resource.id == err.resource.id && x.resource.name == err.resource.name){
            x.error = err.messages;
            x.quantity = 0;
          }
          else{
            x.error = null;
         }});
      }
      );
    this.alertService.warn('Chequee la solicitud, hay articulos sin stock.', { autoClose: true });
    }
  }

  ngOnDestroy(): void {
    console.log('On Destroy Cart ejecutado');
    this.handle.unsubscribe();
   if(this.form){
    this.form.reset();
  }
  }
}
