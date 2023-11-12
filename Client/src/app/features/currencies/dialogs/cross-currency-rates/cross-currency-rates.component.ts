import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyRateExtendedModel } from 'src/app/features/shared/models/currency-rate-extended.model';

@Component({
  templateUrl: './cross-currency-rates.component.html',
  styleUrls: ['./cross-currency-rates.component.scss']
})
export class CrossCurrencyRatesComponent {
  currencyRates: CurrencyRateExtendedModel[];

  constructor(
    private dialogRef: MatDialogRef<CrossCurrencyRatesComponent>,
    @Inject(MAT_DIALOG_DATA) rates: CurrencyRateExtendedModel[]
  ) { this.currencyRates = <any>rates.map(e => {e.isChecked = true; return e;}); }
  
  swap(rate: CurrencyRateExtendedModel){
    let tmp = rate.firstCurrency;
    rate.firstCurrency = rate.secondCurrency;
    rate.secondCurrency = tmp;
    rate.rate = 1 / rate.rate;
  }
  
  save(){
    let ratesToSave = this.currencyRates.filter(e => {
      return e.isChecked;
    });
    this.close(ratesToSave);
  }

  close(rates: CurrencyRateExtendedModel[] | undefined){
    this.dialogRef.close(rates);
  }
}
