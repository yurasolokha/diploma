import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CurrencyRateModel } from 'src/app/features/shared/models/currency-rate.model';
import { CurrencyPaginationModel } from 'src/app/features/shared/models/currency-rates-filter.model';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { ExcelCurrencyRatesExportService } from 'src/app/features/shared/services/local/export/excel-currency-rates-export.service';
import { BaseApiResponse } from 'src/app/utilities/api/base-api-response.model';
import { CreateUpdateCurrencyRateComponent } from '../../../dialogs/create-update-currency-rate/create-update-currency-rate.component';
import { CrossCurrencyRatesComponent } from '../../../dialogs/cross-currency-rates/cross-currency-rates.component';
import { CurrenciesService } from '../../../services/api/currencies.service';
import { CurrencyRatesService } from '../../../services/api/currency-rates.service';
import { CrossRatesService } from '../../../services/client/cross-rates.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';
import { Subscription } from 'rxjs';
import { IPagination } from 'src/app/features/shared/interfaces/pagination.interface';
import { ISort } from 'src/app/features/shared/interfaces/sort.interface';
import { CurrencyRatesDataSource } from '../../../models/currency-rates-datasource';

@UntilDestroy()
@Component({
  selector: 'app-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyRatesComponent implements OnInit, AfterViewInit {
  DataConvention = DataConvention;

  private _sortSubscription: Subscription | null = null;
  private _paginatorSubscription: Subscription | null = null;

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    this._paginator = value;
    if(!this._paginator) return;
    const page = this._mapToPage(this._filter);
    this._paginator.pageSize = page.pageSize;
    this._paginator.pageIndex = page.pageIndex;
    
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
    if(!this._sort) return;
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

        if(!this._paginator.pageIndex) {
          this.filterChange.emit(this._filter);
          return;
        }

        this._paginator.firstPage();
      });
  }
  get sort(): MatSort {
    return this._sort;
  }

  _mapToSort(sort: ISort) {
    if(!sort.sortOrder?.length) {
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

  @Input() set filter(val: CurrencyPaginationModel) {
    this._filter = val;
    if(this.paginator) {
      this.paginator.pageIndex = this._filter?.pageIndex;
    }
    
    this.dataSource?.loadCurrencyRates(this._filter);
  }

  @Output() filterChange = new EventEmitter<CurrencyPaginationModel>();

  private _filter!: CurrencyPaginationModel;
  private _sort!: MatSort;
  private _paginator!: MatPaginator;
  
  @ViewChild('table') table: any;
  public dataSource!: CurrencyRatesDataSource;
  public allowActions: boolean = false;
  
  public displayedColumns: string[] = ['date', 'firstCurrency', 'secondCurrency', 'rate'];

  public menuActions = [
    { icon: 'add', caption: 'Create Currency Rate', action: (u: any) => this.createCurrencyRate() },
    { icon: 'edit', caption: 'Update Currency Rate', action: (u: any) => this.updateCurrencyRate(u) },
    { icon: 'delete', caption: 'Delete Currency Rate', action: (u: any) => this.deleteCurrencyRate(u) },
    { icon: 'cloud_download', caption: 'Export All to Excel', action: (u: any) => this.exportAll() },
    { icon: 'cloud_download', caption: 'Export selected to Excel', action: (u: any) => this.exportSelected() },
  ]

  constructor(private currencyRatesService: CurrencyRatesService,
    private ref: ChangeDetectorRef,
    private crossRatesService: CrossRatesService,
    private authorityService: AuthorityService,
    private exporter: ExcelCurrencyRatesExportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new CurrencyRatesDataSource(this.currencyRatesService);
    this.dataSource.loadCurrencyRates(this._filter);
    this.menuActionsInit()
  }

  private menuActionsInit() {
    this.allowActions = !this.authorityService.currentUserIs(Roles.Reviewer)
  }

  displayError(header: string, description: string){
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };
    
    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel }) 
  }

  createCurrencyRate(){
    this.dialog
    .open(CreateUpdateCurrencyRateComponent, { data: {currencyRate: undefined} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(currency => {
      if(currency) this._createCurrencyRate(currency);
    });
  }

  private _createCurrencyRate(model: CurrencyRateModel){
    this.currencyRatesService.createCurrencyRate(model).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        if(!res) return;

        this.dataSource.loadCurrencyRates(this._filter);
        this.checkCrossCourses(res);
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to create currency rate', error.message);
      },
    });
  }

  updateCurrencyRate(model: CurrencyRateModel){
    if(!model) return;

    this.dialog
    .open(CreateUpdateCurrencyRateComponent, { data: {currencyRate: model} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(currency => {
      if(currency) this._updateCurrencyRate(currency);
    });
  }

  private _updateCurrencyRate(model: CurrencyRateModel){
    this.currencyRatesService.updateCurrencyRate(model).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        if(!res) return;
         
        this.dataSource.loadCurrencyRates(this._filter);
        this.checkCrossCourses(res);
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to update currency rate', error.message);
      },
    });
  }

  deleteCurrencyRate(model: CurrencyRateModel){
    if(!model) return;
    
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this currency?',
      description: 'If you delete this rate you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(isConfirmed) this._deleteCurrencyRate(model);
    });
  }

  private _deleteCurrencyRate(model: CurrencyRateModel) {
    this.currencyRatesService.deleteCurrencyRate(model).pipe(untilDestroyed(this)).subscribe({
      next: (res: BaseApiResponse) => {
        this.snackBar.open(res.message!, undefined, { duration: 1500 });
        if(res.isSuccess) this.dataSource.loadCurrencyRates(this._filter);
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to delete currency rate', error.message);
      },
    });
  }

  private checkCrossCourses(rate: CurrencyRateModel){
    let dateFrom = new Date(rate.date);
    let dateTo = new Date(rate.date);

    dateFrom.setDate(new Date(rate.date).getDate() - 1 );

    let rates = this.dataSource.data.filter(e => dateFrom < new Date(e.date) && dateTo >= new Date(e.date));
    let crossRates = this.crossRatesService.calculateCrossRates(rate, rates);

    if(crossRates.length) this.showCrossRateDialog(crossRates);
  }

  private showCrossRateDialog(rates: CurrencyRateModel[]){
    const dialogRef = this.dialog.open(CrossCurrencyRatesComponent, {
      width: '565px',
      maxHeight: '700px',
      minHeight: '500px',
      data: rates
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe((models: CurrencyRateModel[]) => {
      if(!models || !models.length) return;
      this.currencyRatesService.createCurrencyRates(models).pipe(untilDestroyed(this)).subscribe((res: any) => {
       this.dataSource.loadCurrencyRates(this._filter)
      },
      error => {
        console.log(error);
      });
    });
  }

  exportAll(){
    this.exporter.exportToExcel(this.dataSource.data);
  }

  exportSelected(){
    this.exporter.exportToExcel(this.getSelected(this.dataSource.data));
  }

  private getSelected(items: any[]){
    const rows = Array.from(this.table._elementRef.nativeElement.children[1].children);
    const trIds = rows.filter((e:any) => Array.from(e.classList).some(c => c === 'selected')).map((e: any) => e.id);
    const selected = items.filter(e => trIds.some(id => id === e.id));
    return selected;
  }

  public menuTopLeftPosition =  {x: '0', y: '0'}
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger!: MatMenuTrigger;
  onRightClick(event: MouseEvent, item: any, actions: any) {
    if(!actions || !actions.length) return;
    if(!this.allowActions) return;
    
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } }

    this.matMenuTrigger.openMenu();
  }
}
