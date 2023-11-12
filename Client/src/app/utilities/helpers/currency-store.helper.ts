import { CurrencyModel } from "src/app/features/shared/models/currency.model";
import { Guid } from "../types/guid";
import { Observable } from "rxjs";

export class CurrencyHelper {
    
  public static findCurrency(currencies$: Observable<CurrencyModel[]> ,id: Guid) {
    let currency: CurrencyModel | undefined;
    
    currencies$.subscribe(currencies => {
      currency = currencies.find(e => e.id === id);
    })

    return currency;
  }
}