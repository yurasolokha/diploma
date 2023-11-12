import { CurrencyAction, CurrencyActions as CurrenciesActions } from './currency.action';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';

export const currenciesSelector = 'currencies';

const currenciesInitialState: CurrencyModel[] = [];

export const currencyReducer = ( state: CurrencyModel[] = currenciesInitialState, action: CurrenciesActions) => {
  switch (action.type) {
    case CurrencyAction.SetCurrencies: return state = action.currency;
    case CurrencyAction.GetCurrencies:
    default: return state;
  }
}