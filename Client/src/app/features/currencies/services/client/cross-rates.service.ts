import { Injectable } from '@angular/core';
import { CurrencyRateModel } from 'src/app/features/shared/models/currency-rate.model';

@Injectable({ providedIn: 'root' })
export class CrossRatesService{
  public calculateCrossRates(newRate: CurrencyRateModel, rates: CurrencyRateModel[]): CurrencyRateModel[]{
    let crossRates = rates.reduce((acc, rate) => {
      let crossRate = this.getCrossRate(newRate, rate);

      if(crossRate && !acc.some((e: any) => e.firstCurrency.id === crossRate.firstCurrency.id && e.secondCurrency.id === crossRate.secondCurrency.id)){
        acc.push(crossRate);
      }

      return acc;
    }, [] as any);

    return crossRates;
  }

  private getCrossRate(rate1: any, rate2: any): any{
    if(rate1.firstCurrency.id === rate2.firstCurrency.id && rate1.secondCurrency.id !== rate2.secondCurrency.id) 
      return this.createRate(rate1.secondCurrency, rate2.secondCurrency, rate2.rate / rate1.rate, rate1.date);

    if(rate1.firstCurrency.id === rate2.secondCurrency.id && rate1.secondCurrency.id !== rate2.firstCurrency.id) // good
      return this.createRate(rate1.secondCurrency, rate2.firstCurrency, 1 / rate1.rate / rate2.rate , rate1.date);

    if(rate1.secondCurrency.id === rate2.firstCurrency.id && rate1.firstCurrency.id !== rate2.secondCurrency.id) 
      return this.createRate(rate1.firstCurrency, rate2.secondCurrency, rate1.rate * rate2.rate, rate1.date);

    if(rate1.secondCurrency.id === rate2.secondCurrency.id && rate1.firstCurrency.id !== rate2.firstCurrency.id) // good
      return this.createRate(rate1.firstCurrency, rate2.firstCurrency, rate1.rate / rate2.rate, rate1.date);

    return undefined;
  }

  private createRate(firstCurrency: any, secondCurrency: any, rate: number, date: Date){
    return {
      id: undefined,
      firstCurrency: firstCurrency,
      secondCurrency: secondCurrency,
      rate: rate,
      date: date,
    }
  }
}