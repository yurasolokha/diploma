import { Guid } from 'src/app/utilities/types/guid';
import { AccountModel } from './account.model';
import { CategoryModel } from './category.model';
import { UserModel } from './user.model';

export class TransactionModel {
  id!: Guid;
  isExecuted!: boolean;
  date!: Date;
  amount!: number;
  destinationAmount!: number;
  balance!: number;
  destinationBalance!: number;
  account!: AccountModel;
  destinationAccount!: AccountModel;
  type!: string;
  comment0!: string;
  comment1!: string;
  user!: UserModel;
  categories!: CategoryModel[];
}

export class TransactionsPage {
  transactions!: TransactionModel[];
  totalCount!: number;
}
