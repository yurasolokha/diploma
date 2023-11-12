import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
import { ClassifierControl } from '../models/classifier-contols.model';
  
  export class ClassifierValidator {
    constructor() {}
  
    static createClassifierValidator(
        type: AbstractControl,
        classifierControl: ClassifierControl,
    ): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        return classifierControl.key.requiredTransactionTypes.includes(type.value) ? 
        !control.value ? { required: true } : null : null;
      };
    }
  }
  