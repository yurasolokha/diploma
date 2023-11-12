import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AccountsService } from 'src/app/features/accounts/services/api/accounts.service';
import { CurrenciesService } from 'src/app/features/currencies/services/api/currencies.service';
import { Column } from 'src/app/features/shared/component-models/column';
import { TreeNode, TreeNodeType } from 'src/app/features/shared/component-models/tree-node';
import { CustomTreeComponent } from 'src/app/features/shared/components/custom-tree/custom-tree.component';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { SignalRNotification } from 'src/app/features/shared/models/signalR/signalR.notification';
import { AccountsNotificationsService } from 'src/app/features/shared/services/signalR/accounts-signalR.service';
import { CreateUpdateAccountComponent } from '../../dialogs/create-update-account/create-update-account.component';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';

@UntilDestroy()
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  private _filter!: AccountFilterModel;
  @Input() set filter(value: AccountFilterModel){ this._filter = value; this.loadAccounts(this._filter); };
  @ViewChild('accountTree') accountTree!: CustomTreeComponent;

  isLoading = false;
  accounts!: AccountModel[];
  private _subscription!: Subscription;
  
  private readonly _displayedColumns: Column[] = [
    new Column('name', 'Name'),
    new Column('currency', 'Currency'),
    new Column('description', 'Description'),
    new Column('balance', 'Balance')
  ];

  public accountActions = [
    { icon: 'add', caption: 'Add New Account', action: (u: any) => this.createAccount(u) },
    { icon: 'edit', caption: 'Update Account', action: (u: any) => this.updateAccount(u) },
    { icon: 'delete', caption: 'Delete Account', action: (u: any) => this.deleteAccount(u) },
  ];

  public folderActions = [
    { icon: 'add', caption: 'Create New Folder', action: (u: any) => this.createFolder(u) },
    { icon: 'add', caption: 'Create New Root Folder', action: (u: any) => this.createRootFolder() },
    { icon: 'add', caption: 'Create New Account', action: (u: any) => this.createAccount(u) },
    //TODO { icon: 'edit', caption: 'Rename', action: (u: any) => this.renameFolder(u) },
  ];

  public allowActions: boolean = false;

  public get displayedColumns(): Column[] {
    const cols = [...this._displayedColumns];

    if(this._filter.balanceCurrency) cols.splice(3, 0, new Column('recalculatedBalance', `Balance [${this._filter.balanceCurrency.code}]`));

    return cols;
  }

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly accountsService: AccountsService,
    private authorityService: AuthorityService,
    private readonly notifications: AccountsNotificationsService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ){ }

  ngOnInit(): void {
    this._subscription = this.notifications.onAccount.subscribe( this.onAccount );
    this.menuActionsInit()
  }

  private menuActionsInit() {
    this.allowActions = !this.authorityService.currentUserIs(Roles.Reviewer)
  }

  ngOnDestroy(): void{
    this._subscription.unsubscribe();
  }

  private onAccount = (notification: SignalRNotification) => {
    this.loadAccounts(this._filter);

    this.snackBar.open(`Operation: ${notification.operation}`, undefined, { duration: 500 });
  }

  loadAccounts(filter: AccountFilterModel) {
    this.isLoading = true;

    this.accountsService.getAccounts(filter).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        this.accounts = res;

        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.accounts = [];
        this.isLoading = false;

        this.displayError('Failed to retrieve accounts', error.message);
      },
    });
  }

  displayError(header: string, description: string){
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };
    
    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel }) 
  }

  private renameFolder(account: any){
    console.log(account)
  }

  private createFolder(flatNode: any) {
    this.accountTree.treeControl.expand(flatNode)
    this.accountTree.addFolder(flatNode);
  }

  private createRootFolder() {
    this.accountTree.addRootFolder()
  }

  selectAccount(account: AccountModel) {
    this.router.navigate(['transactions'], {queryParams: {accounts: [account.id], to: this._filter?.balanceDate.getTime() }  })
  }

  selectAccountFolder(control: any,node: any) {
    const items:any[] = (control.getDescendants(node)as any[]).filter(e => e.type === TreeNodeType.item).map(e => e.item.id);
    
    this.router.navigate(['transactions'], {queryParams: { accounts: items, to: this._filter?.balanceDate.getTime() }})
  }

  private createAccount(node: any){
    const folderData = node.item.currency 
    ? {path: node.path}
    : {path: `${node.path === '/' ? '' : node.path}${node.item}/`};
     
    this.dialog
    .open(CreateUpdateAccountComponent, { data: {account: undefined, folderData: folderData} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(newAccount => {
      if(!newAccount) return;
      
      this.accountsService.createAccount(newAccount).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadAccounts(this._filter);
        },
        error: (error) => { 
          console.error(error);
          
          this.displayError('Failed to create account', error.message);
        },
      });
    });
  }

  private updateAccount(node: any){
    this.dialog
    .open(CreateUpdateAccountComponent, { data: {account: node.item, folderData: undefined} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(newAccount => {
      if(!newAccount) return;
      
      this.accountsService.updateAccount(newAccount).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadAccounts(this._filter);
        },
        error: (error) => { 
          console.error(error);

          this.displayError('Failed to update account', error.message); 
        }
      });
    });
  }

  private deleteAccount(node: any){
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this account?',
      description: 'If you delete this account you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(!isConfirmed) return;
      
      this.accountsService.deleteAccount(node.item).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadAccounts(this._filter);
        },
        error: (error) => { 
          console.error(error); 
          
          this.displayError('Failed to delete account', error.message); 
        }
      });
    });
  }

  public folderSelector(acc: AccountModel) {
    return acc.path;
  }

  public itemSelector(acc: AccountModel) {
    return acc;
  }

  public nameSelector(acc: AccountModel) {
    return acc.name;
  }

  public console(acc: any) {
    console.log(acc);
  }

  public accountsSort(acc1: AccountModel, acc2: AccountModel) {
    return (acc2.path+acc2.name).localeCompare(acc1.path+acc1.name);
  }

  public updateFolders = (tree: TreeNode[]) => {
    this.setFolderData(tree);
  }

  private setFolderData(tree: TreeNode[]) {
    return tree.reduce((acc, cur) => {
      let data = cur.item;

      if(cur.type === TreeNodeType.folder) {
        cur.folderData = this.setFolderData(cur.children);
        cur.folderData.folderName = cur.item;
        data = cur.folderData;
      }

      if(!data.currency) return acc;

      if(!acc.currency) acc.currency = data.currency;
      if(data.recalculatedBalance) acc.recalculatedBalance += data.recalculatedBalance;

      if(acc.ignore) return acc;

      if(acc.currency.id === data.currency.id) {
        acc.balance += data.balance;
      }
      else{
        acc.ignore = true;
      }

      return acc;
    },{
      balance: 0,
      currency: undefined,
      recalculatedBalance: 0,
      ignore: false,
      folderName: ''
    } as any);
  }
}
