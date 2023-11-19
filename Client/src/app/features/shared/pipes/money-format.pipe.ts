import { Pipe, PipeTransform } from '@angular/core';
import {DecimalPipe} from "@angular/common";

@Pipe({
  name: 'moneyFormat',
})
export class MoneyFormatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number | string): string | null {
    return this.decimalPipe.transform(value, '1.2-2')?.replace(/,/g, ' ') ?? null;
  }

}
