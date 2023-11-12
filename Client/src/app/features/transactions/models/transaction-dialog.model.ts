import { TransactionModel } from '../../shared/models/transaction.model';

export class TransactionDialogModel {
  public transaction: TransactionModel | undefined;

  public dateRange: Date[] | undefined;
}