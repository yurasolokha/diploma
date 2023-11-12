import { TurnoverRateReportItem } from './turnover-rate-report-item.model';

export class TurnoverRateReportModel{
  maxDateDiff!: number;
  minDateDiff!: number;
  avgDateDiff!: number;
  timeStamp!: Date;
  incomeRates!: TurnoverRateReportItem[];
  expenseRates!: TurnoverRateReportItem[];
}