
import { Guid } from 'src/app/utilities/types/guid';
import { CurrencyModel } from './currency.model';
import {UserAccessValue} from "./user-access.model";

export class AccountModel
{
  id!: Guid;
  name!: string;
  path!: string;
  description!: string;
  currency!: CurrencyModel;
  balance!: number;
  recalculatedBalance!: number;
  startingBalance!: number;
}

export class AccountCreateRequest extends AccountModel{
  userAccesses?: UserAccessValue[]
}
