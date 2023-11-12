import { Guid } from 'src/app/utilities/types/guid';
import { UserModel } from './user.model';

export class BlockedDateModel{
  id!: Guid;
  dateFrom!: Date;
  dateTo!: Date;
  user!: UserModel;
}