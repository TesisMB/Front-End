import { AlertService } from './../../services/_alert.service/alert.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialsService } from '../materials/materials.service';
import { Request } from 'src/app/models';
import { MatSnackBar } from '@angular/material/snack-bar';


interface EmergenciesInput {
  value: number;
  viewValue: string;
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
  emergencyGroups: Emergencies[] = [
    {
      name: 'Tormenta',
      emergency: [
        {value: 1, viewValue: 'Rio Cuarto'},
        {value: 2, viewValue: 'Rio Tercero'},
        {value: 3, viewValue: 'Rio Primero'},
      ],
    },
    {
      name: 'Inundacion',
      emergency: [
        {value: 4, viewValue: 'Jesus Maria'},
        {value: 5, viewValue: 'Cordoba'},
        {value: 6, viewValue: 'Cosquin'},
      ],
    },
    {
      name: 'Incendio',
      disabled: true,
      emergency: [
        {value: 7, viewValue: 'Villa Maria'},
        {value: 8, viewValue: 'Jesus Maria'},
        {value: 9, viewValue: 'Cordoba'},
      ],
    },
    {
      name: 'Terremoto',
      emergency: [
        {value: 10, viewValue: 'Villa Maria'},
        {value: 11, viewValue: 'Jesus Maria'},
      ],
    },
  ];

  
  request: Request = null;
  error:any;
  handle: any;
  form: FormGroup;
  loading: boolean = false;


  constructor( 
    private requestService: MaterialsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _snackBar: MatSnackBar
) {
  this.getRequest();

 }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      Reason: ['Probando', [Validators.required]],
      FK_EmergencyDisasterID: [1, [Validators.required]],
      resources_RequestResources_Materials_Medicines_Vehicles: this.formBuilder.array([
        this.formBuilder.group({
          FK_MaterialID: [''],
          quantity: [''],
          FK_MedicineID: [''],
          FK_VehiclesID: [''],
        })
      ])
    });

  }

  get f() {return this.form.controls;}
  get isRequest(){ return this.request ? true : false;}
  get getStyle() { return this.request.request.length >= 2 ? '230px' : 'max-content';}


  submitCart(){
    if(this.form.valid){
    this.isLoading();

    const f = {
      Reason: this.form.get('Reason').value,
      FK_EmergencyDisasterID : 2,
      Resources_RequestResources_Materials_Medicines_Vehicles:[],
    };
    this.request.request.forEach(item => {
      const resp:any = {};
     //   FK_VolunteersID: null

      if(item.resource.materials){
        resp.FK_MaterialID = item.resource.id;
        resp.Quantity = item.quantity;
      }else if(item.resource.medicines){
       resp.FK_MedicineID = item.resource.id;
       resp.Quantity = item.quantity;
      }else if(item.resource.vehicles){
       resp.FK_VehiclesID= item.resource.id;

     }else if(item.resource.volunteers){
    //  resp.FK_VolunteersID = item.resource.id
      }
      f.Resources_RequestResources_Materials_Medicines_Vehicles.push(resp);

    });
    console.log('Datos pre-post: ', f);
    this.postCart(f);
  }
}

  getRequest(){
    this.isLoading();
    
    this.handle = this.requestService._request
    .subscribe(
      items => {
        this.request = items;
        this.error = undefined;
        this.loading = false;

      },
      error => {
        this.error = error;
       // this.isLoading();
       // this.alertService.error('Ha ocurrido un error :(, intente mas tarde', { autoClose: true });
          
      });
      }

  deleteFromCart(index:number){
  this.requestService.deleteFromCart(index);
  }

  isLoading(){
  this.loading =!this.loading;
  console.log('loading: ',this.loading);
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
    this.alertService.error('Ha ocurrido un error', { autoClose: true });
    console.log('Error del post: ', error.message);
     this.isLoading();
  } );
  }
  getErrorMessage(value) {
    if(value <= 0)  {
      return 'La cantidad minima para solicitar es 1.';
    }  else {
      return 'La cantidad maxima de stock disponible es';
    } 
   
  }
  getMax(i){
  const max =  this.request.request[i].quantity + this.request.request[i].resource.quantity;
  
    return  max;
  }
  ngOnDestroy(): void {
    this.handle.unsubscribe();
  }   
}
