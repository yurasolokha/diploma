import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionFilterModel } from 'src/app/features/shared/models/transaction-filter.model';
import { TransactionPaginationRequstModel } from 'src/app/features/shared/models/transaction-pagination.model';
import {
  TransactionsPage,
  TransactionModel,
} from 'src/app/features/shared/models/transaction.model';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends AbstractRestService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  public getTransactionTypes() {
    return this.get(`transactions/transaction-types`);
  }

  public getTransactionsFiltered(filter: TransactionFilterModel) {
    return this.postItem<TransactionFilterModel, TransactionModel[]>(
      `transactions/transactions-filtered`,
      filter
    );
  }

  public getTransactions(model: TransactionPaginationRequstModel) {
    return this.postItem<TransactionPaginationRequstModel, TransactionsPage>(
      `transactions/transactions-filtered`,
      model
    );
  }

  public createTransaction(transaction: TransactionModel) {
    return this.putItem(`transactions/create-transaction`, transaction);
  }

  public updateTransaction(transaction: TransactionModel) {
    return this.postItem(`transactions/update-transaction`, transaction);
  }

  public updateTransactionsRange(transactions: TransactionModel[]) {
    return this.postItem(
      `transactions/update-transactions-range`,
      transactions
    );
  }

  public deleteTransaction(transaction: TransactionModel) {
    return this.delete(`transactions/delete-transaction`, transaction.id);
  }
}
