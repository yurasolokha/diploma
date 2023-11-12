import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'asString'})
export class AsStringPipe implements PipeTransform {
  transform(items: any[], key: string): string {
    return items ? items.map(e => e[key]).join(', ') : '';
  }
}
