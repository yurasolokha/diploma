import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../models/user.model';

@Pipe({ name: 'userInitials' })
export class UserInitialsPipe implements PipeTransform {

  transform(user: UserModel | null): string {
    if(!user) return '';

    if(user.firstName && user.lastName) return `${user.firstName[0]} ${user.lastName[0]}`;
    else if(user.firstName && !user.lastName) return user.firstName[0];
    
    return '';
  }
}
