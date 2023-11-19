import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import {AccountCreateRequest, AccountModel} from 'src/app/features/shared/models/account.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class AccountsService  extends AbstractRestService {
  constructor(protected override http: HttpClient){ super(http); }

  public getAccounts(filter: AccountFilterModel) {
    return this.postItem(`accounts/accounts`, filter);
  }

  public createAccount(accountCreateRequest: AccountCreateRequest) {
    return this.putItem(`accounts/create-account`, accountCreateRequest);
  }

  public updateAccount(account: AccountModel) {
    return this.postItem(`accounts/update-account`, account);
  }

  public deleteAccount(account: AccountModel) {
    return this.delete(`accounts/delete-account`, account.id);
  }
}
