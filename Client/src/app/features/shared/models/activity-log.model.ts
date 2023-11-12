import { Guid } from 'src/app/utilities/types/guid';

export class ActivityLogModel {
  public transactionId!: Guid;
  public userEmail!: string;
  public actionTime!: Date;
  public action!: string;
}