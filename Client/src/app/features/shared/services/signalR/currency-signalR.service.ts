import { Injectable } from '@angular/core';
import { NotificationInstance } from '../../enums/notification-instance.enum';
import { SignalRNotification } from '../../models/signalR/signalR.notification';
import { NotificationService } from './notification.service';
import { Observable, filter } from 'rxjs';
import { CurrenciesService } from 'src/app/features/currencies/services/api/currencies.service';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';

@Injectable({ providedIn: 'root' })
export class CurrencyNotificationsService {
  public onCurrency: Observable<SignalRNotification>;

  constructor(
    private readonly notifications: NotificationService,
    private readonly authorityService: AuthorityService,
    private readonly currenciesService: CurrenciesService
  ) {
    this.onCurrency = this.notifications
      .onNotificationReceived
      .pipe(filter(e => e.instance === NotificationInstance.currency));

    this.onCurrency.subscribe(e => this.updateStore(e));
  }

  public updateStore(notification?: SignalRNotification) {
    if(notification && notification.sender == this.authorityService.currentUser()) return;

    this.getUpdateObservable().subscribe();
  }

  public getUpdateObservable() {
    return this.currenciesService.loadIntoStore()
  }
}
