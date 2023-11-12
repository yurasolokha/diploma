import { AccountModel } from '../account.model';
import { ClassifierModel } from '../classifier.model';
import { CurrencyModel } from '../currency.model';

export class TurnoverRateReportRequestModel{
  from!: Date;
  to!: Date;
  currency!: CurrencyModel;
  classifier!: ClassifierModel;
  accounts!: AccountModel[];
  types!: string[];
}