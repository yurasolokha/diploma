import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { TokenStoreService } from 'src/app/utilities/auth/token.store';
import { environment } from 'src/environments/environment';
import { SignalRNotification } from '../../models/signalR/signalR.notification';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly signalRNotifications = `${environment.api_url}/notifications`;

  private _connection: any;
  private readonly _userId;
  private readonly NotifyMethod: string = 'Notify';

  public readonly onNotificationReceived = new EventEmitter<SignalRNotification>();
  public readonly onSelfNotificationReceived = new EventEmitter<SignalRNotification>();

  constructor(private tokenStore: TokenStoreService) { 
    this._userId = this.tokenStore.getUserId(); 
    this.initialize();
  }

  private initialize(): void {
    const options = {
      accessTokenFactory: () => this.tokenStore.getToken()
    } as signalR.IHttpConnectionOptions;

    this._connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Critical)
    .withUrl(this.signalRNotifications, options)
    .withAutomaticReconnect()
    .build();

    this._connection.start()
    .then(() => console.log('Connected successfully!'))
    .catch((err: any) => console.log('Error while starting connection: ' + err));

    this._connection.on(this.NotifyMethod, this.Notify);
  }

  ngOnDestroy(): void {
    this._connection.stop();
  }

  private Notify = (notification: SignalRNotification) => {
    if(notification.sender === this._userId) {
      this.onSelfNotificationReceived.emit(notification);
      return;
    } 

    this.onNotificationReceived.emit(notification);
  }
}
