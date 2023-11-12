
import { CurrencyModel } from '../currency.model';

export class CurrencyRateReportRequest
{
  from!: Date;
  to!: Date;
  firstCurrency!: CurrencyModel;
  secondCurrency!: CurrencyModel;
}