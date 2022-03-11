import { Role, Input , Group, User} from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import { UserService } from './../index';
import { AlertService} from '../../services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
selector: 'register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
    currentUser: User = null;
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error: any = "";
    registerHandler: any;
    genre = [{value: 'M', viewValue:'Masculino'},{value: 'F', viewValue:'Femenino'}, {value: 'O', viewValue:'Otrx'}];
    estates : any[] = [];
    locations: any[] = [];
    roles: Role[];
    minDate: Date;
    maxDate: Date;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
        private tableService: TableService
    ) {
    //   if(this.user.users.roleName=='Admin'){ 
    //   this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario');
    //   this.canReset = true;
    // }  
    // else {
    //   this.roles = this.userService.listarRoles.filter(roles => roles.RoleName !=='Voluntario' && 'Admin');
    //   this.canReset = false
    // }

    }

    ngOnInit() {
      this.getDateValidations();
      this.getLocations()
      this.roles = this.userService.listarRoles;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      

      this.registerForm = this.formBuilder.group({
        users: this.formBuilder.group({
          userDni:      ['', [Validators.required,Validators.pattern("[0-9]{7,9}[a-zA-Z ]{0,2}")]],
          FK_RoleID:    ['', [Validators.required]],
          FK_EstateID:    ['', [Validators.required]],
          FK_LocationID: ['', [Validators.required]],
        persons: this.formBuilder.group({
            firstName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,15}")]],
            lastName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,15}")]],
            phone:    ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{9,11}$")]],
            gender:    ['',[ Validators.required]],
            email:    ['',[Validators.required,Validators.email]],
            address: ['',[Validators.required]],
            birthdate: ['',[Validators.required]]
          }),
        }),
      });
      
        // this.formUser.get('FK_LocationID').valueChanges.subscribe(value =>{
        //   this.estates = this.locations.filter(x => x.locationID === value);
        // } );
    }

    // Es un getter conveniente para facilitar el acceso a los campos del formulario
    get f() { return this.registerForm.controls; }
    get formUser () { return this.registerForm.get('users');}
    get formPerson () { return this.registerForm.get('users.persons');}
     get estate(){
       const estate = this.locations.filter(x => x.locationCityName === this.currentUser.estates.locationCityName);
       return estate
      }
  
    private getDateValidations(){
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();

      this.minDate = new Date(currentYear - 99,currentMonth, currentDate);
      this.maxDate = new Date(currentYear - 18, currentMonth, currentDate);
     // const max = this.maxDate.;
     // console.log(max);
     // console.log(this.minDate);
    }


    onSubmit() {

        // this.formUser.get('FK_LocationID').patchValue();
        //Resetea las alertas
        this.alertService.clear();
        // STOP si el formulario es invalido.
        if (this.registerForm.invalid) {
          console.log("No registró");
            return;
        }
        this.loading = true;
        this.register();
        
    }

  private register(){

      this.registerHandler = this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('Registro exitoso :)', { autoClose: true });
             // this.router.navigate(['/'], { relativeTo: this.route });
             // this.tableService.uploadTable();
              this.loading = false;

          },
          error => {
              this.error = error;
              this.alertService.errorForRegister(error);
              this.loading = false;

          });
    }
    private getLocations(){
      this.userService.getLocations().subscribe(
        data => {
          this.locations = data;
          console.log(data);
        },
        error => {
          console.log(error);
        }
      )
    }
        
    // onSelectFile(event) {
    //   if (event.target.files && event.target.files[0]) {
    //     let reader = new FileReader();

    //     reader.readAsDataURL(event.target.files[0]); // Lee el archivo como DATA URL

    //     reader.onload = (event) => { // Es llamado cuando el metodo readAsDataURL es completado
    //       this.url = event.target.result;

    //     }
    //   }
    // }
    ngOnDestroy(){
      if(this.registerHandler){
      this.registerHandler.unsubscribe();
    }
    }
}
