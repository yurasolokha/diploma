import { Guid } from 'src/app/utilities/types/guid';
import { NotificationInstance } from '../../enums/notification-instance.enum';
import { NotificationOperation } from '../../enums/notification-operation.enum';

export class SignalRNotification {
  public instance!: NotificationInstance;
  public operation!: NotificationOperation;
  public sender!: Guid;
}