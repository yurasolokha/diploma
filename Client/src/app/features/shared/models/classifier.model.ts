import { Guid } from 'src/app/utilities/types/guid';

export class ClassifierModel{
  id!: Guid;
  orderWeight!: number;
  pluralName!: string;
  singularName!: string;
  requiredTransactionTypes!: string[];
}