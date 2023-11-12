import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
  finalize,
} from 'rxjs';
import { TransactionsService } from '../services/api/transactions.service';
import { TransactionModel } from '../../shared/models/transaction.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TransactionPaginationRequstModel } from '../../shared/models/transaction-pagination.model';
import * as moment from 'moment';

@UntilDestroy()
export class TransactionsDataSource implements DataSource<TransactionModel> {
  private transactionsSubject = new BehaviorSubject<TransactionModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _sort: MatSort | null = null;
  private _paginator: MatPaginator | null = null;

  constructor(private transactionsService: TransactionsService) {}

  get data(): TransactionModel[] {
    return this.transactionsSubject.value;
  }

  get sort(): MatSort | null {
    return this._sort;
  }

  set sort(sort: MatSort | null) {
    this._sort = sort;
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  _updatePaginator(filteredDataLength: number): void {
    if (!this.paginator) return;

    this.paginator.length = filteredDataLength;
  }

  connect(collectionViewer: CollectionViewer): Observable<TransactionModel[]> {
    return this.transactionsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.transactionsSubject.complete();
    this.loadingSubject.complete();
  }

  loadTransactions(filter: TransactionPaginationRequstModel) {
    this.loadingSubject.next(true);

    var filterWithoutOffset:TransactionPaginationRequstModel = {
      ...filter, 
      from: moment(filter.from.getTime()).utc(true).toDate(),
      to: moment(filter.to.getTime()).utc(true).toDate()
    }

    this.transactionsService
      .getTransactions(filterWithoutOffset)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (result) => {
          this.transactionsSubject.next(result.transactions);
          this._updatePaginator(result.totalCount);
        },
      });
  }
}
