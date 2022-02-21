import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService, AlertService } from 'src/app/services';
import { validarPasswords } from 'src/app/_helpers/validator';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  eyeHide = true;
  hide = true;
  handler: any;
  token: string = null;

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
    this.resetForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: validarPasswords }
    );

    // Obtiene el token por parametro
    this.route.queryParams
      .pipe(filter((params) => params.token))
      .subscribe((params) => {
        this.token = params.token;
      });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get r() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Resetea alertas
    this.alertService.clear();

    // Para aca si el form es invalido
    if (this.resetForm.invalid) {
      return;
    }

    if (this.token) {
      this.loading = true;

      console.log('Envió');
      this.setNewPassword();
    } else {
      this.alertService.warn(
        'Token incorrecto, por favor ingrese desde el link enviado en el correo.',
        { autoClose: true }
      );
    }
  }

  passwordMatchValidator(): boolean {
    return (
      this.resetForm.hasError('notIquals') &&
      this.resetForm.get('password').dirty &&
      this.resetForm.get('confirmPassword').dirty
    );
  }

  setNewPassword() {
    this.handler = this.authenticationService
      .changePassword(this.token, this.resetForm.get('password').value)
      .pipe()
      .subscribe(
        (data) => {
          console.log(data);
          this.alertService.info('Contraseña cambiada exitosamente :) ', {
            keepAfterRouteChange: true,
            autoClose: true,
          });
          this.loading = false;
          this.router.navigate(['/cliente/login']);
        },
        (error) => {
          console.log(error);
          this.alertService.error('Ha ocurrido un error :(', {
            autoClose: true,
          });
          this.loading = false;
        }
      );
  }

  OnDestroy() {
    this.handler.unsubscribe();
  }
}
