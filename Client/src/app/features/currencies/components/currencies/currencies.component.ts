import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import * as moment from 'moment';
import { CurrencyPaginationModel } from 'src/app/features/shared/models/currency-rates-filter.model';
import { QueryHelper } from 'src/app/utilities/helpers/query.helper.ts';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrenciesComponent implements OnInit {
  private _filter: CurrencyPaginationModel = new CurrencyPaginationModel();

  get filter() {
    return this._filter;
  }

  set filter(value: CurrencyPaginationModel) {
    this.queryHelper.setQueryParams(this._mapToParams(value));
    this._filter = value;
  }

  filterChangeWithPageReset(value: CurrencyPaginationModel) {
    value.pageIndex = 0;
    this.filter = value;
  }

  private _mapToParams(filter: CurrencyPaginationModel) {
    return {
      smoothFilter: filter.smoothFilter,
      from: filter.from.getTime(),
      to: filter.to.getTime(),
      firstCurrency: filter.firstCurrency,
      secondCurrency: filter.secondCurrency,
      includeCount: filter.includeCount,
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
      sortOrder: filter.sortOrder,
    };
  }

  private _mapToFilter(params: Params): CurrencyPaginationModel {
    const filter = new CurrencyPaginationModel(
      params["pageIndex"],
      params["pageSize"],
      true,
      params["sortOrder"] ?? 'date.desc'
    );

    const from = params['from'];
    const to = params['to'];
    const smoothFilter = params['smoothFilter'];

    filter.firstCurrency = params['firstCurrency'];
    filter.secondCurrency = params['secondCurrency'];

    if(from)
      filter.from = moment(Number.parseInt(from)).toDate();
    if(to)
      filter.to = moment(Number.parseInt(to)).toDate();
    if(smoothFilter)
      filter.smoothFilter = smoothFilter == 'true';
    
    return filter
  }

  constructor(private router: Router, private queryHelper: QueryHelper) {}

  ngOnInit(): void {
    this.filter = {...this.filter, ...this._mapToFilter(this.queryHelper.params)};
  }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }
}
