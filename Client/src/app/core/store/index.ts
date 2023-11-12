import { ActionReducerMap } from '@ngrx/store';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { userReducer, userSelector } from './user/user.reducer';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { currencyReducer, currenciesSelector } from './currency/currency.reducer';

export interface State {
  [userSelector]: UserModel
  [currenciesSelector]: CurrencyModel[]
}

export const reducers: ActionReducerMap<State> = {
	[userSelector]: userReducer as any,
  [currenciesSelector]: currencyReducer as any,
};
