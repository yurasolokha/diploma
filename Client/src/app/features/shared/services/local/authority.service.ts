import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';
import { selectUserFeature } from 'src/app/core/store/user/user.selectors';
import { RoleModel } from '../../models/role.model';
import { Guid } from 'src/app/utilities/types/guid';

@Injectable({ providedIn: 'root' })
export class AuthorityService {
  constructor(private readonly store: Store) { }

  private user$ = this.store.select(selectUserFeature);

  currentUser() {
    let userId: Guid | undefined;

    this.user$.subscribe(user => {
      userId = user.id;
    })

    return userId;
  }

  currentUserIs(role: Roles) { 
    let roles: RoleModel[] = [];

    this.user$.subscribe(user => { 
      roles = user.roles;
    });

    return roles.some((e: RoleModel) => e.name === role);
  }
}
