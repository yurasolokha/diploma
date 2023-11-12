import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize, map } from 'rxjs';
import { TransactionFilterModel } from 'src/app/features/shared/models/transaction-filter.model';
import { TransactionPaginationRequstModel } from 'src/app/features/shared/models/transaction-pagination.model';
import { QueryHelper } from 'src/app/utilities/helpers/query.helper.ts';
import { Guid } from 'src/app/utilities/types/guid';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit {
  private _filter: TransactionPaginationRequstModel = new TransactionPaginationRequstModel();

  filterChangeWithReset(filter: TransactionPaginationRequstModel) {
    filter.pageIndex = 0;
    this.filter = filter
  }

  public get filter(): TransactionPaginationRequstModel {
    return this._filter;
  }

  public set filter(value: TransactionPaginationRequstModel) {
    this.queryHelper.setQueryParams(this._mapToParams(value));
    this._filter = value;
  }

  constructor(private queryHelper: QueryHelper) {}

  ngOnInit(): void {
    this.filter = { ...this._filter, ...this._mapToFilter(this.queryHelper.params)};
  }

  private _mapToFilter(params: Params) : TransactionPaginationRequstModel {
    const from = params['from'];
    const to = params['to'];

    const allowedTypes = params['allowedTypes'] ?? [];
    const categories = params['categories'] ?? [];
    const accounts = params['accounts'] ?? [];

    const pageIndex = params['pageIndex'] ?? 0;
    const pageSize = params['pageSize'] ?? 50;

    const sortOrder:string = params['sortOrder'] ?? 'date.desc';
      
    return new TransactionPaginationRequstModel( new TransactionFilterModel(
      from ? moment(Number.parseInt(from)).toDate() : undefined,

      to ? moment(Number.parseInt(to)).toDate() : undefined,

      params['comment'],

      Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes],

      (Array.isArray(categories)
        ? categories.length
          ? categories.map((e) => ({id: e}))
          : []
        : [{id: categories}]) as any,

      (Array.isArray(accounts)
        ? accounts.length
          ? accounts.map((e) => ({id: e}))
          : []
        : [{id: accounts}]) as any
    ),
    pageIndex,
    pageSize,
    true,
    sortOrder);
  }

  private _mapToParams(transactionFilter: TransactionPaginationRequstModel): Params {
            
    return {
        accounts: transactionFilter.accounts.map((account) => account.id),
        categories: transactionFilter.categories.map((category) => category.id),
        from: transactionFilter.from.getTime(),
        to: transactionFilter.to.getTime(),
        allowedTypes: transactionFilter.allowedTypes,
        comment: transactionFilter.comment,
        includeCount: transactionFilter.includeCount,
        pageIndex: transactionFilter.pageIndex,
        pageSize: transactionFilter.pageSize,
        sortOrder: transactionFilter.sortOrder,
    };
  }
}
