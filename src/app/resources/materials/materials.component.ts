import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

<<<<<<< Updated upstream
  constructor() { }

  ngOnInit(): void {
  }

=======
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: ResourcesService,
    private requestService: MaterialsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.tipo;
    this.getParams();
    this.getItems();

    this.form = this.formBuilder.group({
      quantity: [0]
    });


    //   if(this.checkStock) {
    //   this.form.disable();
    // }



  }
  // get availability(){
  //   return this.item.volunteers ? this.item.volunteers.status : this.item.availability;
  //  }

  get f() { return this.form.controls; }
  get checkStock() { return (!this.item.availability || (this.item.quantity <= 0 && this.item.quantity != null)); }

  getParams() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.type = params.tipo;

      if ((params.id || params.tipo) == 'undefined' || null) {
        this.router.navigate(['**']);
      }
    });
  }

  onBack() {
    this.location.back();
  }


  getErrorMessage() {
    if (this.f.quantity.hasError('required')) {
      return 'Seleccione la cantidad ha solicitar.';
    }
    else if (this.f.quantity.hasError('max')) {
      return 'La cantidad maxima de stock disponible es ' + this.item.quantity;
    }

    else if (this.f.quantity.hasError('min')) {
      return 'La cantidad minima para solicitar es 1';
    }
  }

  getItems() {
    this.handler = this.service.getById(this.id, this.type).subscribe(
      (data) => {
        this.item = data;
        this.getQuantity();
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

  getQuantity() {
    let cart = null;
    this.requestService._request.subscribe(x => cart = x);
    if (cart) {
      cart.request.forEach((value) => {
        if (value.resource.name == this.item.name) {
          if (this.item.quantity > value.quantity)
            this.item.quantity -= value.quantity;
          else if (this.item.quantity <= value.quantity)
            this.item.quantity = 0;
        }
      });
    }
  }


  onSubmit() {

    // this.submitted = true;
    if (this.form.valid) {
      const quantity: number = this.form.get('quantity').value || 1;
      this.item.quantity -= quantity;
      const userID = this.authenticationService.currentUserValue.userID;
      const request: Request = {
        id: this.id,
        userID: userID,
        createDate: Date.now(),
        state: false,
        request: [{
          resource: this.item,
          quantity: quantity
        }]
      };
      console.log('Item solicitado: ', request);
      this.requestService.setRequest(request);

      this.form.reset();
    }
    if (this.checkStock) {
      this.form.disable();
    }
    // this.submitted = false;

  }

>>>>>>> Stashed changes
}
