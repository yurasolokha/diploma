import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { UserModel } from '../../shared/models/user.model';
import { NewUserModel } from '../models/new-user.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService extends AbstractRestService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  public createNewUser(user: NewUserModel) {
    return this.putItem('users/create-user', user);
  }

  public updateUser(user: NewUserModel) {
    return this.postItem('users/update-user', user);
  }

  public deleteUser(user: UserModel) {
    return this.delete('users/delete-user', user.id!);
  }

  public getUsers() {
    return this.get<UserModel[]>('users/users');
  }

  public isEmailNotRegistered = (email: string) => {
    return this.get<boolean>('users/email/exist', { email }).pipe(
      map((e) => !e)
    );
  };

  public isUserNotRegistered = (userName: string) => {
    return this.get<boolean>('users/user/exist', { userName }).pipe(
      map((e) => !e)
    );
  };
}
