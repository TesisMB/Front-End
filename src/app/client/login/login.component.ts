import { AlertService, AuthenticationService } from '../../services';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models';


@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']}
)
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    hide=true;
    eyeHide = true;
    currentUser: User;
    handler: any;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
         //Redirecciona si el usuario esta logeado
         if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            userDni: ['', Validators.required],
            userPassword: ['', Validators.required]

        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }





    onSubmit() {
        this.submitted = true;

        // Resetea alertas
        this.alertService.clear();

        // Para aca si el form es invalido
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
       this.handler = this.authenticationService
            .login(this.loginForm.get('userDni').value, this.loginForm.get('userPassword').value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                  this.alertService.error('Ha ingresado el usuario o la contraseña incorrectamente');
                  this.loading = false;
                  this.alertService.errorForEmployee(error);
                });
    }

    OnDestroy() {
        this.handler.unsubscribe();
    }

}
