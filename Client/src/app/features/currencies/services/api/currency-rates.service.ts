import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrencyRateModel } from 'src/app/features/shared/models/currency-rate.model';
import { CurrencyRatesFilter, SimpleCurrencyRatesFilter } from 'src/app/features/shared/models/currency-rates-filter.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class CurrencyRatesService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public getCurrencyRates(filter: CurrencyRatesFilter) {
    return this.postItem('currencyRate/currency-rates', filter);
  }

  public getLastCurrencyRates() {
    return this.get<any>('currencyRate/last-currency-rates');
  }

  public getLastCurrencyRate(filter: SimpleCurrencyRatesFilter) {
    return this.get<any>('currencyRate/last-currency-rate', filter);
  }

  public createCurrencyRate(rate: CurrencyRateModel) {
    return this.putItem('currencyRate/create-currency-rate', rate);
  }

  public createCurrencyRates(rates: CurrencyRateModel[]) {
    return this.putItem('currencyRate/create-currency-rates', rates);
  }

  public deleteCurrencyRate(rate: CurrencyRateModel) {
    return this.delete<any>('currencyRate/delete-currency-rate', rate.id);
  }

  public updateCurrencyRate(rate: CurrencyRateModel) {
    return this.postItem('currencyRate/update-currency-rate', rate);
  }
}