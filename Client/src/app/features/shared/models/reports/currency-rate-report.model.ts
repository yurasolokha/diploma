import { CurrencyRateReportItem } from './currency-rate-report-item.model';

export class CurrencyRateReportModel
{
  timeStamp!: Date;
  rates!: CurrencyRateReportItem[];
}