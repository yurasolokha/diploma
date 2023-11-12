import { Guid } from 'src/app/utilities/types/guid';
import { AccountModel } from './account.model';

export class AccountTreeNode {
  account!: AccountModel;
  folder!: {
    folderPath: string;
    folderName: string;
  }
  children!: AccountTreeNode[];
  parent!: AccountTreeNode;
  balance?:{
    value: number;
    recalculatedValue: number;
    currency: Guid;
  }
}

export class AccountTreeFlatNode {
  account!: AccountModel;
  folder!: {
    folderPath: string;
    folderName: string;
  }
  level!: number;
  expandable!: boolean;
  balance?:{
    value: number;
    recalculatedValue: number;
    currency: Guid;
  }
}