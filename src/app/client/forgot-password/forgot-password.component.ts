import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AlertService } from 'src/app/services';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    resetForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    hide=true;
    handler: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
         //Redirecciona si el usuario esta logeado
         if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
     
        this.resetForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      }
    // convenience getter for easy access to form fields
    get r() { return this.resetForm.controls; }


    onSubmit() {
        this.submitted = true;

        // Resetea alertas
        this.alertService.clear();

        // Para aca si el form es invalido
        if (this.resetForm.invalid) {
            return;
        }

        this.loading = true;
       this.handler = this.authenticationService
            .sendEmail(this.resetForm.value)
            .pipe()
            .subscribe(
                data => {
                    console.log(data);
                    this.alertService.info('Correo enviado, revise su correo electronico.', {autoClose: true})
                   // this.router.navigate([this.returnUrl]);
                     this.loading = false;

                },
                error => {
                  console.log(error);
                  this.alertService.error('Ha ocurrido un error :(', {autoClose: true});
                  this.loading = false;
                });
    }

    OnDestroy() {
        this.handler.unsubscribe();
    }

}
