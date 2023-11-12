
import { AccountModel } from '../account.model';
import { CurrencyModel } from '../currency.model';

export class AccountsBalanceReportRequest
{
  from!: Date;
  to!: Date;
  accounts!: AccountModel[];
  currency!: CurrencyModel;
}