import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ResourcesService } from './../resources.service';
import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Resource, Request } from 'src/app/models';
import { MaterialsService } from './materials.service';
import { AuthenticationService } from 'src/app/services';

const card = document.querySelector(".content");

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css'],
})
export class MaterialsComponent implements OnInit {
  id: number = null;
  type: string = null;
  isRequest: boolean = false;
  item: Resource = null;
  handler: any;
  error: any = '';
  form: FormGroup;
  handlerRequest: any;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: ResourcesService,
    private requestService: MaterialsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.tipo;

    this.getParams();
    this.getItems();

   this.form = this.formBuilder.group({
     quantity: [0]
 });

  }
  get availability(){
    return this.item.volunteers ? this.item.volunteers.status : this.item.availability;
  
  }


  getParams() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.type = params.tipo;
      console.log(this.id);
      console.log(this.type);

      if ((params.id || params.tipo) == 'undefined' || null) {
        this.router.navigate(['**']);
      }
    });
  }

  onBack() {
    this.location.back();
  }

  getItems() {
    this.handler = this.service.getById(this.id, this.type).subscribe(
      (data) => {
        this.item = data;
        console.log(this.item);
        this.form.controls.quantity.setValidators([
          Validators.required,
          Validators.min(1),
          (control: AbstractControl) => Validators.max(this.item.quantity)(control)
      ]);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  requestItem(){
  //this.request = !this.request;
    console.log('Estado Solicitud: ', this.isRequest);
    if(this.isRequest === true){
      
    }
  }
 onSubmit(){
   if(this.form.valid){
   const quantity: number = this.form.get('quantity').value || 1;
   this.item.quantity -= quantity;
   const userID = this.authenticationService.currentUserValue.userID;
   const request: Request = {
    id: this.id,
    userID: userID,
    createDate: Date.now(),
    state: false,
    request:[{
      resource: this.item,
      quantity: quantity 
    }]
   };
   console.log('Item solicitado: ', request);
   this.requestService.setRequest(request);
   this.form.reset();
  }
 }

}
