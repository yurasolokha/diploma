import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DataConvention } from 'src/app/core/contracts/data.convention';

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  transform(value: {dateFrom: Date, dateTo: Date}, ...args: unknown[]): unknown {
    return `${moment(value.dateFrom).format(DataConvention.DateFormat)} - ${moment(value.dateTo).format(DataConvention.DateFormat)}`;
  }
}
