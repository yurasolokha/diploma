import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  constructor() {}

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valid = regex.test(control.value);

      return valid ? null : error;
    };
  }

  static matchValidator(
    passwordControlName: string,
    confirmPasswordControlName: string
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordControlName);
      const confirmPassword = control.get(confirmPasswordControlName);

      if (!confirmPassword || !password)
        throw new Error('Pasword controls not found');

      // if the confirmPassword value is null or empty, don't return an error.
      if (!password.value?.length) {
        return null;
      }

      // compare the passwords and see if they match.
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        // if passwords match, don't return an error.
        return null;
      }
    };
  }
}
