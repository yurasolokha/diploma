import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SignalRNotification } from 'src/app/features/shared/models/signalR/signalR.notification';
import { AccessesNotificationsService } from './../../../shared/services/signalR/accesses-signalR.service';
import {
  AccessModel,
  UpdateAccessModel
} from '../../models/access.model';
import { AccessesService } from './../../services/accesses.service';
import { UsersService } from './../../services/users.service';
import { Column, ColumnTitle } from './components/access-table/models/column.model';
import { AccessTab } from './models/access-tab.model';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';
import { Guid } from 'src/app/utilities/types/guid';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss'],
})
export class AccessManagementComponent implements OnInit {
  private _subscription!: Subscription;
  isLoading = true;
  isTabLoading = true;

  public tabs: AccessTab[] = []
  public selectedTabIndex!: number;

  public frozenColumns: Column[] = [
    new Column('name', new ColumnTitle('Name')),
  ];

  tabAccesses: BehaviorSubject<AccessModel[]> = new BehaviorSubject<AccessModel[]>([]);
  users: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly usersService: UsersService,
    private readonly accessesService: AccessesService,
    private readonly classifiersService: ClassifiersService,
    private readonly notifications: AccessesNotificationsService
  ) {}

  ngOnInit(): void {
    this.loadTabs();  
    this._subscription = this.notifications.onAccess.subscribe(this.onAccess);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private loadTabs() {
    const accountAccesses$ = this.loadAccountAccesses()
    const classifiers$ = this.classifiersService.getClassifiers()

    this.loadUsers().pipe(untilDestroyed(this)).subscribe(users => {
      this.users.next(users);

      const accountLoadFunc = this.createTabContentLoadFunction(accountAccesses$).bind(this);
      this.addNewTab(-1, 'Accounts', this.users, this.tabAccesses, accountLoadFunc, this.createTabContentUpdateFunction(e => (this.accessesService.updateAccountAccess(e)), accountLoadFunc).bind(this))

      classifiers$.pipe(untilDestroyed(this)).subscribe(classifiers => {
        classifiers.forEach(classifier => {
          const classifierLoadFunc = this.createTabContentLoadFunction(this.loadCategoryAccesses(classifier.id)).bind(this);
          this.addNewTab(classifier.orderWeight, classifier.pluralName, this.users, this.tabAccesses, classifierLoadFunc, this.createTabContentUpdateFunction(e => (this.accessesService.updateCategoryAccess(e)), classifierLoadFunc).bind(this));
        })
      })

      this.tabIndexChangeHandler(0);
      
      this.isLoading = false;
    });
  }

  public tabIndexChangeHandler(index: number) {
    this.isTabLoading = true;
    this.selectedTabIndex = index;
    this.tabs[index].loadFunction(this.tabAccesses);
  }

  private createTabContentLoadFunction(observable: Observable<AccessModel[]>) {
    return (dataContext: BehaviorSubject<AccessModel[]>) => {
      observable.pipe(untilDestroyed(this)).subscribe(value => {
        dataContext.next(value);
        this.isTabLoading = false;
      })
    }
  }
  
  private createTabContentUpdateFunction(updateFunction: (updateAccessModels: UpdateAccessModel[]) => Observable<unknown>, loadFunction: (dataContext: BehaviorSubject<AccessModel[]>) => void) {
    return (updateAccessModels: UpdateAccessModel[]) => {
      updateFunction(updateAccessModels).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            loadFunction(this.tabAccesses);
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  private addNewTab(index: number,label: string, users: BehaviorSubject<UserModel[]>, accesses: BehaviorSubject<AccessModel[]>, loadFunction: (dataContext: BehaviorSubject<AccessModel[]>) => void, updateMethod: (data: UpdateAccessModel[]) => void) {
    this.tabs.push({
      index: index,
      label: label,
      frozenColumns: this.frozenColumns,
      users: users,
      data: accesses,
      loadFunction: loadFunction,
      updateHandler: updateMethod,
    })

    this.tabs.sort((a,b) => a.index - b.index);
  }

  private onAccess = (notification: SignalRNotification) => {

    this.snackBar.open(`Operation: ${notification.operation}`, undefined, {
      duration: 500,
    });
  };

  private loadUsers() {
    return this.usersService.getUsers()
  }
  
  private loadAccountAccesses() {
    return this.accessesService
      .getAccountsAccesses()
      .pipe(
        map((respond) => {
          return respond.map((res) => {
            const accessModel = new AccessModel();
            Object.assign(accessModel, res);

            let accessesDictionary = Object.assign(
              {},
              ...res.accesses.map((x) => ({ [x.userId]: x.accessLevel }))
            );
            accessModel.accesses = accessesDictionary;

            return accessModel;
          });
        })
      );
  }

  private loadCategoryAccesses(classifierId: Guid) {
    return this.accessesService
      .getCategoryAccesses(classifierId)
      .pipe(
        map((respond) => {
          return respond.map((res) => {
            const accessModel = new AccessModel();
            Object.assign(accessModel, res);

            let accessesDictionary = Object.assign(
              {},
              ...res.accesses.map((x) => ({ [x.userId]: x.accessLevel }))
            );
            accessModel.accesses = accessesDictionary;

            return accessModel;
          });
        })
      );
  }
}
