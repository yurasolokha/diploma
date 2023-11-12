import { Action } from '@ngrx/store';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';

export enum CurrencyAction {
  GetCurrencies = '[Currency] Get',
  SetCurrencies = '[Currency] Set',
}

export class GetCurrenciesAction implements Action {
  public readonly type = CurrencyAction.GetCurrencies;
}

export class SetCurrenciesAction implements Action {
  public readonly type = CurrencyAction.SetCurrencies;

  constructor(public currency: CurrencyModel[]) { }
}

export type CurrencyActions = GetCurrenciesAction | SetCurrenciesAction;
