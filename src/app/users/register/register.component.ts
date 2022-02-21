import { Role } from 'src/app/models';
import { TableService } from 'src/app/services/_table.service/table.service';
import { UserService } from './../index';
import { AlertService} from '../../services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


@Component({
selector: 'register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error: any = "";
    registerHandler: any;
    genre = [{value: 'M', viewValue:'Masculino'},{value: 'F', viewValue:'Femenino'}, {value: 'O', viewValue:'Otrx'}];
    estate = [{value: 1 , viewValue:'Filial Cordoba'},{value: 2 , viewValue:'Filial Rio Tercero'},{value: 3 , viewValue:'Filial Jesus Maria'},]
    roles: Role[];

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
      
      this.roles = this.userService.listarRoles;

      this.registerForm = this.formBuilder.group({
        users: this.formBuilder.group({
          userDni:      ['', [Validators.required,Validators.pattern("[0-9]{7,8}")]],
          FK_RoleID:    ['', Validators.required],
          FK_EstateID:    ['', Validators.required],
        persons: this.formBuilder.group({
            firstName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,254}")]],
            lastName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,254}")]],
            phone:    ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{9,11}$")]],
            gender:    ['', Validators.required],
            email:    ['',[Validators.required,Validators.email]],
            address: ['',[Validators.required]],
            birthdate: ['', [Validators.required,Validators.pattern("[0-9]{4}-[0-9]{2}-[0-9]{2}")]],
          })
        })
      });
      //  this.registerForm.valueChanges.subscribe(() => console.log(this.gender));
    }

    // Es un getter conveniente para facilitar el acceso a los campos del formulario
    get f() { return this.registerForm.controls; }
    get formUser () { return this.registerForm.get('users');}
    get formPerson () { return this.registerForm.get('users.persons');}
    

    onSubmit() {
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
              this.tableService.uploadTable();
              this.loading = false;

          },
          error => {
              this.error = error;
              this.alertService.error('Ha ocurrido un error :( , intente nuevamente mas tarde', {autoClose: true});
              this.loading = false;

          });
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
