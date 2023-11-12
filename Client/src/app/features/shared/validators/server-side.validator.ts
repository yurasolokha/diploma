import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

export class ServerSideValidators {
  constructor() {}

  static createServerValidator(
    observableFunction: (value: string) => Observable<boolean>,
    requstError: ValidationErrors,
    error: ValidationErrors
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return observableFunction(control.value).pipe(
        map((valid) => (valid ? null : error)),
        catchError((e) => {
          console.error(e);
          return of(requstError);
        })
      );
    };
  }
}
