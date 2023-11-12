import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { SetCurrenciesAction } from 'src/app/core/store/currency/currency.action';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class CurrenciesService extends AbstractRestService {

  constructor(protected override http: HttpClient, public store: Store){ super(http); }

  public loadIntoStore() {
    return this.getCurrencies().pipe(tap(e => {
      this.store.dispatch(new SetCurrenciesAction(e))
    }))
  }

  public getCurrencies() {
    return this.get<CurrencyModel[]>('currency/currencies');
  }

  public createCurrency(currency: CurrencyModel) {
    return this.putItem('currency/create-currency', currency);
  }

  public deleteCurrency(currency: CurrencyModel) {
    return this.delete<any>('currency/delete-currency', currency.id);
  }

  public updateCurrency(currency: CurrencyModel) {
    return this.postItem('currency/update-currency', currency);
  }
}