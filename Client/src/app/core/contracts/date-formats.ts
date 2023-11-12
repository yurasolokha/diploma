import { NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { DataConvention } from './data.convention';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const OUR_DATE_FORMAT = {
  parse: {
    dateInput: DataConvention.DateFormat,
  },
  display: {
    dateInput: DataConvention.DateFormat,
    monthYearLabel: DataConvention.MonthYearLabel,
    dateA11yLabel: DataConvention.DateFormat,
    monthYearA11yLabel: DataConvention.MonthYearLabel,
  },
};

export const OUR_NGX_DATE_FORMAT: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: DataConvention.DateTimeExtendedFormat,
    monthYearLabel: DataConvention.MonthYearLabel,
    dateA11yLabel: DataConvention.DateTimeExtendedFormat,
    monthYearA11yLabel: DataConvention.MonthYearLabel,
  }
};