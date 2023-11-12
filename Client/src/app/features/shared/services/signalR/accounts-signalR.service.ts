import { Injectable } from '@angular/core';
import { NotificationInstance } from '../../enums/notification-instance.enum';
import { SignalRNotification } from '../../models/signalR/signalR.notification';
import { NotificationService } from './notification.service';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountsNotificationsService {
  public onAccount: Observable<SignalRNotification> = 
    this.notifications.onNotificationReceived.pipe(filter(e => e.instance === NotificationInstance.account));

  constructor(private readonly notifications: NotificationService) {}
}
