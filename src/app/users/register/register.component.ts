import { UserService } from './../index';
import { AlertService} from '../../services';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
@Component({
selector: 'register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error: any = "";
    registerHandler: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        users: this.formBuilder.group({
          userDni:      ['', [Validators.required,Validators.maxLength(8),Validators.pattern("[0-9]{7,15}")]],
          FK_RoleID:    [1, Validators.required],
          FK_EstateID:    [1, Validators.required],
          userPassword: ['admin123'],
          persons: this.formBuilder.group({
            firstName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,254}")]],
            lastName: ['', [Validators.required,Validators.pattern("[a-zA-Z ]{2,254}")]],
            phone:    ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            gender:    ['', Validators.required],
            email:    ['',[Validators.required,Validators.email]],
            address: [''],
            birthdate: ['', [Validators.required,Validators.pattern("[0-9]{4}-[0-9]{2}-[0-9]{2}")]],
          })
        })
      });
    //    this.registerForm.valueChanges.subscribe(() => console.log(this.formPerson.valid));
    }

    // Es un getter conveniente para facilitar el acceso a los campos del formulario
    get f() { return this.registerForm.controls; }
    get formUser () { return this.registerForm.get('users');}
    get formPerson () { return this.registerForm.get('users.persons');}
    
    

    onSubmit() {

        this.submitted = true;
        //Resetea las alertas
        this.alertService.clear();
        // STOP si el formulario es invalido.
        //*Falta Mensaje de alerta avisando que no se registro exitosamente. */
        if (this.registerForm.invalid) {
          console.log("No registró");
            return;
        }
        this.register();
        this.loading = true;
        
    }

    register(){
      this.registerHandler = this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('Registro exitoso :)', { keepAfterRouteChange: true, autoClose: true });
              this.router.navigate(['/'], { relativeTo: this.route });
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
