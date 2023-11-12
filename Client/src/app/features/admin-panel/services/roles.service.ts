import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { RoleModel } from '../../shared/models/role.model';

@Injectable({providedIn: 'root'})
export class RolesService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public createRole(role: RoleModel) {
    return this.putItem('roles/create-role', role);
  }

  public updateRole(role: RoleModel) {
    return this.postItem('roles/update-role', role);
  }

  public deleteRole(role: RoleModel) {
    return this.delete('roles/delete-role', role.id!);
  }

  public getRoles() {
    return this.get('roles/roles');
  }
}