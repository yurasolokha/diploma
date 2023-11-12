import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../models/user.model';

@Pipe({ name: 'userFullName' })
export class UserFullNamePipe implements PipeTransform {

  transform(user: UserModel | null): string {
    if(!user) return '';

    if(user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    else if(user.firstName && !user.lastName) return user.firstName;
    
    return '';
  }
}
