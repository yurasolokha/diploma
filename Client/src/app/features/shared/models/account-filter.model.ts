import { CurrencyModel } from './currency.model';

export class AccountFilterModel {
  constructor(
    public balanceDate: Date = <any>undefined,
    public balanceCurrency: CurrencyModel = <any>undefined
  ) {}
}