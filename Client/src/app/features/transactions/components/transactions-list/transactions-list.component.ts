import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { SignalRNotification } from 'src/app/features/shared/models/signalR/signalR.notification';
import { TransactionExtendedModel } from 'src/app/features/shared/models/transaction-extended.model';
import { TransactionFilterModel } from 'src/app/features/shared/models/transaction-filter.model';
import { TransactionTableColumnModel } from 'src/app/features/shared/models/transaction-table-column.model';
import { SettingsService } from 'src/app/features/shared/services/api/settings.service';
import { ExcelTransactionsExportService } from 'src/app/features/shared/services/local/export/excel-transactions-export.service';
import { TransactionsNotificationsService } from 'src/app/features/shared/services/signalR/transactions-signalR.service';
import { Guid } from 'src/app/utilities/types/guid';
import { TransactionCreateUpdateComponent } from '../../dialogs/transaction-create-update/transaction-create-update.component';
import { TransactionsService } from '../../services/api/transactions.service';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { AuthenticationService } from 'src/app/features/shared/services/local/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';
import { TransactionModel } from 'src/app/features/shared/models/transaction.model';
import { TransactionsDataSource } from '../../models/transactions-datasource';
import { TransactionPaginationRequstModel } from 'src/app/features/shared/models/transaction-pagination.model';
import { ISort } from 'src/app/features/shared/interfaces/sort.interface';
import { IPagination } from 'src/app/features/shared/interfaces/pagination.interface';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { TransactionType } from 'src/app/utilities/costants/transaction-type.constant';
import { TransactionFileImportComponent } from '../../dialogs/transaction-file-import/transaction-file-import.component';
import { ImportService } from 'src/app/features/admin-panel/services/import.service';

@UntilDestroy()
@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table: any;

  private _sortSubscription: Subscription | null = null;
  private _paginatorSubscription: Subscription | null = null;

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    this._paginator = value;
    const page = this._mapToPage(this._filter);
    this._paginator.pageIndex = page.pageIndex;
    this._paginator.pageSize = page.pageSize;
    
    if (this._paginatorSubscription) {
      this._paginatorSubscription.unsubscribe();
    }

    this._paginatorSubscription = this._paginator.page
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        if(!this._filter) return;

        this._filter = {...this._filter, pageIndex: e.pageIndex, pageSize: e.pageSize}

        this.filterChange.emit(this._filter)
      });
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  _mapToPage(paginator: IPagination) {

    return {
      pageIndex: paginator.pageIndex ?? 0,
      pageSize: paginator.pageSize ?? 50
    }
  }

  @ViewChild(MatSort) set sort(value: MatSort) {
    this._sort = value;
    const sort = this._mapToSort(this._filter);
    this._sort.active = sort.active;
    this._sort.direction = (sort.direction) as any;

    if (this._sortSubscription) {
      this._sortSubscription.unsubscribe();
    }

    this._sortSubscription = this._sort.sortChange
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        this._filter = {...this._filter, sortOrder: `${e.active}.${e.direction}`}

        if(!this._filter.pageIndex) {
          this.filterChange.emit(this._filter);
          return;
        }

        this.paginator.firstPage();
      });
  }
  get sort(): MatSort {
    return this._sort;
  }

  _mapToSort(sort: ISort) {
    if(!sort.sortOrder) {
      return {
        active: "date",
        direction: "desc"
      }
    }

    const parts = sort.sortOrder.split('.');

    return {
      active: parts[0],
      direction: parts[1],
    };
  }

  @Input() set filter(val: TransactionPaginationRequstModel) {
    this._filter = val;
    if(this.paginator)
      this.paginator.pageIndex = this._filter?.pageIndex;
    
    this.dataSource?.loadTransactions(this._filter);
  }

  @Output() filterChange = new EventEmitter<TransactionPaginationRequstModel>();

  private _filter!: TransactionPaginationRequstModel;
  private _subscription!: Subscription;
  private _sort!: MatSort;
  private _paginator!: MatPaginator;

  public isLoading: boolean = false;
  public dataSource!: TransactionsDataSource;
  public displayedColumns: TransactionTableColumnModel[] = [];

  public get tableColumns() {
    return this.displayedColumns.map((e) => e.propertyName);
  }
  public get classifierColumns() {
    return this.displayedColumns.filter((e) => e.columnType === 'classifier');
  }
  public get format() {
    return this.withTime
      ? DataConvention.PipeDateTimeFormat
      : DataConvention.PipeDateFormat;
  }

  public withTime: boolean = false;
  public pageSizes = [50, 100, 200, 500];

  public advancedActions = [
    {
      icon: 'add',
      caption: 'Add Transaction',
      action: (u: any) => this.addTransaction(),
    },
    {
      icon: 'edit',
      caption: 'Duplicate Transaction',
      action: (u: any) => this.duplicateTransaction(u),
    },
    {
      icon: 'edit',
      caption: 'Edit Transaction',
      action: (u: any) => this.editTransaction(u),
    },
    {
      icon: 'delete',
      caption: 'Delete Transaction',
      action: (u: any) => this.deleteTransaction(u),
    },
    {
      icon: 'cloud_download',
      caption: 'Export all to Excel',
      action: (u: any) => this.exportAllTransactions(),
    },
    {
      icon: 'cloud_download',
      caption: 'Export selected to Excel',
      action: (u: any) => this.exportSelected(),
    },
    {
      icon: 'cloud_upload',
      caption: 'Import from Excel',
      action: (u: any) => this.import(),
    },
  ];

  public menuActions = [
    {
      icon: 'save',
      caption: 'Save Column State',
      action: (u: any) => this.saveColumnState(),
    },
    {
      icon: 'view_column',
      caption: 'Display All Columns',
      action: (u: any) => this.displayAllColumns(),
    },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private transactionsService: TransactionsService,
    private authorityService: AuthorityService,
    public authService: AuthenticationService,
    private notifications: TransactionsNotificationsService,
    private readonly importService: ImportService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new TransactionsDataSource(this.transactionsService);
    this.dataSource.loadTransactions(this._filter);
    this.menuActionsInit();
    this.loadDisplayedColumns();
    this._subscription = this.notifications.onTransaction.subscribe(
      this.onTransaction
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private menuActionsInit() {
    !this.authorityService.currentUserIs(Roles.Reviewer)
      ? (this.menuActions = [...this.advancedActions, ...this.menuActions])
      : null;
  }

  private onTransaction = (notification: SignalRNotification) => {
    this.dataSource.loadTransactions(this._filter);

    this.snackBar.open(`Operation: ${notification.operation}`, undefined, {
      duration: 500,
    });

    this.ref.detectChanges();
  };

  private loadDisplayedColumns() {
    this.settingsService
      .getDisplayedColumns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (columns: any) => {
          this.displayedColumns = columns.sort(
            (e1: any, e2: any) => e1.weight - e2.weight
          );
          this.ref.detectChanges();
        },
        error: (error: { message: string }) => {
          console.error(error);

          this.displayError('Failed to load columns', error.message);
        },
      });
  }

  displayError(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel });
  }

  swapColumns({ first, second }: any) {
    this.displayedColumns.splice(
      second,
      0,
      this.displayedColumns.splice(first, 1)[0]
    );
  }

  getTableCell(
    column: TransactionTableColumnModel,
    transaction: TransactionExtendedModel
  ) {
    return transaction.categories.find(
      (c) => c.classifier.id === column.propertyName
    )?.name;
  }

  removeColumn(property: string) {
    this.displayedColumns.splice(
      this.displayedColumns.indexOf(
        this.displayedColumns.find((e) => e.propertyName === property) as any
      ),
      1
    );
  }

  selectAccount(account?: AccountModel) {
    if (!account?.id) return;

    const filter = new TransactionFilterModel();
    filter.accounts = [account];

    const newFilter = {...this._filter, ...filter};

    this.filterChange.emit(newFilter);
  }

  saveColumnState() {
    let columnsForSave = this.displayedColumns.map((element, index) => {
      element.weight = index;
      return element;
    });

    this.settingsService
      .updateDisplayedTransactionColumns(columnsForSave)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.snackBar.open(res.message, '', { duration: 1000 });
        },
        error: (error: { message: string }) => {
          console.error(error);

          this.displayError('Failed to save column state', error.message);
        },
      });
  }

  import() {
    this.dialog
      .open(TransactionFileImportComponent, {
        width: '700px',
        height: '420px',
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((isUpdated: boolean) => {
        if (!isUpdated) return;
      });
  }

  displayAllColumns() {
    this.settingsService
      .getAllDisplayedColumns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (columns: any) => {
          this.displayedColumns = columns.sort(
            (e1: any, e2: any) => e1.weight - e2.weight
          );
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  exportSelected() {
    this.importService.exportTransactionsByIdsToExcel(this.getSelectedTransactionIds())
    .subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = `${(new Date()).toISOString()}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    })
  }

  private getSelectedTransactionIds() {
    const rows = Array.from(
      this.table._elementRef.nativeElement.children[1].children
    );
    
    const trIds = rows
      .filter((e: any) => Array.from(e.classList).some((c) => c === 'selected'))
      .map((e: any) => e.id);
    return trIds;
  }

  exportAllTransactions() {
    this.importService.exportFiltredTransactionsToExcel(this._filter)
    .subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = `${(new Date()).toISOString()}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    })
    
  }

  getTransactionFromFilter(filter: TransactionPaginationRequstModel) {
    const type = filter.allowedTypes.length === 1 ? filter.allowedTypes[0] : TransactionType.Expense;
    const account = (type === TransactionType.Transfer && filter.accounts.length == 2) || filter.accounts.length === 1 ? filter.accounts[0] : undefined;
    const classifiers = filter.categories.flatMap((category) => category.classifier);
    let categories: CategoryModel[] | undefined = undefined;
    for (const classifier of classifiers) {
      const cats = filter.categories.filter(cat => cat.classifier.id === classifier.id && cat.types.includes(type));
      if(cats.length == 1) {
        if(!categories) {
          categories = [] as any;
        }
        categories?.push(cats[0])
      };
    }
    const destinationAccount = (type === TransactionType.Transfer && filter.accounts.length == 2) ? filter.accounts[1] : undefined;

    let transaction: any = {
      isExecuted: true,
      date: new Date(),
      type: type,
      account: account,
      categories: categories,
      destinationAccount: destinationAccount,
      comment0: filter.comment,
      amount: 0,
      destinationAmount: 0
    }

    return transaction;
  }

  addTransaction(): void {
    this.dialog
      .open(TransactionCreateUpdateComponent, {
        width: '700px',
        height: '660px',
        data: {
          transaction: this.getTransactionFromFilter(this._filter),
          dateRange: [this._filter.from, this._filter.to],
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((updated: TransactionModel) => {
        if (!updated) return;

        this.transactionsService
          .createTransaction(updated)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.dataSource.loadTransactions(this._filter);
              else this.displayError('Operation denied', res.message);
            },
            error: (error: { message: string }) => {
              console.error(error);

              this.displayError('Failed to add transaction', error.message);
            },
          });
      });
  }

  editTransaction(transaction: TransactionExtendedModel): void {
    this.dialog
      .open(TransactionCreateUpdateComponent, {
        width: '700px',
        height: '660px',
        data: {
          transaction: transaction,
          dateRange: [this._filter.from, this._filter.to],
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((updated: TransactionModel) => {
        if (!updated) return;

        this.transactionsService
          .updateTransaction(updated)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.dataSource.loadTransactions(this._filter);
              else this.displayError('Operation denied', res.message);
            },
            error: (error: { message: string }) => {
              console.error(error);

              this.displayError('Failed to update transaction', error.message);
            },
          });
      });
  }

  duplicateTransaction(transaction: TransactionExtendedModel): void {
    this.dialog
      .open(TransactionCreateUpdateComponent, {
        width: '700px',
        height: '660px',
        data: {
          transaction: { ...transaction, id: Guid.newGuid(), date: new Date() },
          dateRange: [this._filter.from, this._filter.to],
          isDuplicate: true
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((updated: TransactionModel) => {
        if (!updated) return;

        this.transactionsService
          .createTransaction(updated)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.dataSource.loadTransactions(this._filter);
              else this.displayError('Operation denied', res.message);
            },
            error: (error: { message: string }) => {
              console.error(error);

              this.displayError(
                'Failed to duplicate transaction',
                error.message
              );
            },
          });
      });
  }

  deleteTransaction(transaction: TransactionExtendedModel): void {
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this transaction?',
      description: '',
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data: dialogModel })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((canDelete: any) => {
        if (!canDelete) return;

        this.transactionsService
          .deleteTransaction(transaction)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              if (res.isSuccess) this.dataSource.loadTransactions(this._filter);
              else this.displayError('Operation denied', res.message);
            },
            error: (error: { message: string }) => {
              console.error(error);

              this.displayError('Failed to delete transaction', error.message);
            },
          });
      });
  }

  public menuTopLeftPosition = { x: '0', y: '0' };
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  onRightClick(event: MouseEvent, item: any, actions: any) {
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } };

    this.matMenuTrigger.openMenu();
  }
}
