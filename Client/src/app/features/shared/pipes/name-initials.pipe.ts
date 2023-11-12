import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nameInitials' })
export class NameInitialsPipe implements PipeTransform {

  transform(fullName: string): string {
    return `${fullName.substr(0,1)} ${fullName.substr(fullName.lastIndexOf(" ") + 1,1)}`;
  }
}
