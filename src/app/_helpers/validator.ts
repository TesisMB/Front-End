import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarPasswords: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password.value === confirmPassword.value ? null : { 'notIquals': true };
};
