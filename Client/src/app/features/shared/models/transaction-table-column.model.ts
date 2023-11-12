import { Guid } from 'src/app/utilities/types/guid';

export class TransactionTableColumnModel
{
  id!: Guid;
  weight!: number;
  columnName!: string;
  columnType!: string;
  propertyName!: string;

  public toString = () : string => { return this.propertyName; }
}