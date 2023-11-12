import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/features/shared/services/local/auth.service';
import { TokenStoreService } from 'src/app/utilities/auth/token.store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private tokenStore: TokenStoreService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this.authenticationService.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenStore.getToken()}`,
        }
      });
    }

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        const error = {
          statusCode: response.status,
          message: this.errorFor[response.status] || response.statusText
        }

        if (error.statusCode === 401) this.authenticationService.logout();

        return throwError(() => new Error(error as any));
      })
    );;
  }

  // general descriptions of common error messages are described here
  // if necessary, this list can be extended
  private errorFor: any = 
  {
    401: 'Unauthorized! Please re-login.',
    404: 'The requested resource was not found.',
    500: 'An error occurred on the server side!',
  }
}
