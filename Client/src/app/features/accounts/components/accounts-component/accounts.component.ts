import { Component } from '@angular/core';
import { Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { QueryHelper } from 'src/app/utilities/helpers/query.helper.ts';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {
  private _filter: AccountFilterModel = new AccountFilterModel();
  private currencies$ = this.store.pipe(select(selectCurrenciesFeature));

  get filter() {
    return this._filter;
  }

  set filter(value: AccountFilterModel) {
    this.queryHelper.setQueryParams(this._mapToParams(value));
    this._filter = value;
  }

  private _mapToParams(filter: AccountFilterModel) {
    return {
      balanceCurrency: filter.balanceCurrency?.id,
      balanceDate: filter.balanceDate.getTime(),
    };
  }

  private _mapToFilter(params: Params): AccountFilterModel {
    const filter = new AccountFilterModel();

    const balanceDate = params['balanceDate'];
    const balanceCurrency = params['balanceCurrency'];

    filter.balanceDate = !!balanceDate ? moment(Number.parseInt(balanceDate)).toDate() : new Date();
    if(balanceCurrency) {
      this.currencies$.subscribe(e => {
        const res = e.find(e => e.id === balanceCurrency)
        filter.balanceCurrency = <any>res;
      })
    }
    
    return filter
  }

  constructor(public store: Store, private queryHelper: QueryHelper) {}

  ngOnInit(): void {
    this.filter = {...this.filter, ...this._mapToFilter(this.queryHelper.params)};
  }
}
