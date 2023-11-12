import { Guid } from 'src/app/utilities/types/guid';
import { CurrencyModel } from './currency.model';

export class CurrencyRateModel {
  id!: Guid;
  date!: Date;
  firstCurrency!: CurrencyModel;
  secondCurrency!: CurrencyModel;
  rate!: number;
}