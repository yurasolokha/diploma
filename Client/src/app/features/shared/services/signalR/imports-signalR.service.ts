import { Injectable } from '@angular/core';
import { NotificationInstance } from '../../enums/notification-instance.enum';
import { SignalRNotification } from '../../models/signalR/signalR.notification';
import { NotificationService } from './notification.service';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImportsNotificationsService  {
  public onImport: Observable<SignalRNotification> = 
    this.notifications.onSelfNotificationReceived.pipe(filter(e => e.instance === NotificationInstance.import));

  constructor(private readonly notifications: NotificationService) {}
}
