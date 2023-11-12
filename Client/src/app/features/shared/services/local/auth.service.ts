import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenStoreService } from '../../../../utilities/auth/token.store';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { Store } from '@ngrx/store';
import { RemoveUserAction } from 'src/app/core/store/user/user.action';
import { CurrencyNotificationsService } from 'src/app/features/shared/services/signalR/currency-signalR.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private tokenStore: TokenStoreService,
    private store$: Store<UserModel>,
    private currencyNotificationsService: CurrencyNotificationsService
  ) { }
  
  login(username: string, password: string) {
    const url = environment.api_url;
    const tokenUrl = environment.token_path;
    const client = environment.client_id;
    const grantType = environment.grant_type;

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', });

    const params = new HttpParams()
    .set('username', username)
    .set('password', password)
    .set('client_id', client)
    .set('grant_type', grantType);

    const path = `${url}/${tokenUrl}`;

    return this.http.post<any>(path, params.toString(), {headers:headers}).pipe(map(token => {
      const accessToken = token.access_token;
      this.tokenStore.setToken(accessToken);
      return accessToken;
    }));
  }
  
  logout() {
    this.tokenStore.removeToken();
    this.store$.dispatch(new RemoveUserAction());
  }
  
  isLoggedIn(): boolean {
    return this.tokenStore.isTokenExpired() == false;
  }
  me(refreshLookups?: boolean): Observable<UserModel> {
    let request = this.http.get<any>(`${environment.api_url}/users/me`).pipe<UserModel>(map(res => res.content));

    if(refreshLookups) {
      request = request.pipe(switchMap(res => this.currencyNotificationsService.getUpdateObservable().pipe(map(() => res))));
    }

    return request;
  }
}