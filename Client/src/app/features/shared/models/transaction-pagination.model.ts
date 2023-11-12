import { SortDirection } from '@angular/material/sort';
import { IPagination } from '../interfaces/pagination.interface';
import { ISort } from '../interfaces/sort.interface';
import { TransactionFilterModel } from './transaction-filter.model';

export class TransactionPaginationRequstModel
  extends TransactionFilterModel
  implements IPagination, ISort
{
  constructor(
    filter: TransactionFilterModel = new TransactionFilterModel(),
    public pageIndex: number = 0,
    public pageSize: number = 50,
    public includeCount: boolean = true,
    public sortOrder: string = '',
  ) {
    super(
      filter.from,
      filter.to,
      filter.comment,
      filter.allowedTypes,
      filter.categories,
      filter.accounts
    );
  }
}