import { createFeatureSelector } from '@ngrx/store';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { currenciesSelector } from './currency.reducer';

export const selectCurrenciesFeature = createFeatureSelector<CurrencyModel[]>(currenciesSelector);

