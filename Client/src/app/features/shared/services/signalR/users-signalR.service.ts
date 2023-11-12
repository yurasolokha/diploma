import { Injectable } from '@angular/core';
import { NotificationInstance } from '../../enums/notification-instance.enum';
import { SignalRNotification } from '../../models/signalR/signalR.notification';
import { NotificationService } from './notification.service';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersNotificationsService {
  public onUser: Observable<SignalRNotification> = 
    this.notifications.onNotificationReceived.pipe(filter(e => e.instance === NotificationInstance.user));

  constructor(private readonly notifications: NotificationService) {}
}
