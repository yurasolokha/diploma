import { AccountsBalanceReportItem } from './accounts-balance-report-item.model';

export class AccountsBalanceReportModel
{
  maxDateDiff!: number;
  minDateDiff!: number;
  avgDateDiff!: number;
  timeStamp!: Date;
  balances!: AccountsBalanceReportItem[];
}