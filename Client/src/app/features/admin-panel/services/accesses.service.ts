import { ApiAccessModel, UpdateAccessModel } from '../models/access.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { Guid } from 'src/app/utilities/types/guid';

@Injectable({ providedIn: 'root' })
export class AccessesService extends AbstractRestService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  public updateAccountAccess(updateAccessModels: UpdateAccessModel[]) {
    return this.postItem('accesses/update-accounts-accesses', {accesses: updateAccessModels});
  }

  public getAccountsAccesses() {
    return this.get<ApiAccessModel[]>('accesses/accounts-accesses');
  }

  public updateCategoryAccess(updateAccessModels: UpdateAccessModel[]) {
    return this.postItem('accesses/update-categories-accesses', {accesses: updateAccessModels});
  }

  public getCategoryAccesses(classifierId: Guid) {
    return this.get<ApiAccessModel[]>(`accesses/categories-accesses/${classifierId}`);
  }
}
