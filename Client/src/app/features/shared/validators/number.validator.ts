import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class NumberValidators {
  constructor() {}

  static isNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
        return null;
    }

    const invalid = Number.isNaN(Number.parseFloat(control.value));

    return invalid ? { notNumber: true } : null;
  }

  static isGreaterThen(value: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const current = Number.parseFloat(control.value);

        const valid = current > value;

        return valid ? null : { less: true };
    }
  }

  static isLessThen(value: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const current = Number.parseFloat(control.value);

        const valid = current < value;

        return valid ? null : { greater: true };
    }
  }

  

  static isEqual(value: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const current = Number.parseFloat(control.value);

        const valid = current === value;

        return valid ? null : { unequal: true };
    }
  }
}
