import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialsService } from '../materials/materials.service';
import { Request } from 'src/app/models';


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
  error:any= "";
  handle: any;
  form: FormGroup;


  constructor( 
    private requestService: MaterialsService,
    private formBuilder: FormBuilder,
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
  get getStyle() { return this.request.request.length >= 2 ? '230px' : 'fit-content';}


  submitCart(){
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
    this.requestService.postRequest(f)
   .subscribe(
     data => this.clearCart(),
     error => console.log('Error del post: ', error)
   );
  }
  getRequest(){
    this.handle = this.requestService._request
    .subscribe(
      items => this.request = items,
      error => this.error = error
    );
  }
  deleteFromCart(index:number){
  this.requestService.deleteFromCart(index);
    
  }
    clearCart(){
    this.requestService.clearCartRequest();
  }

  ngOnDestroy(): void {
    this.handle.unsubscribe();
  }   
}
