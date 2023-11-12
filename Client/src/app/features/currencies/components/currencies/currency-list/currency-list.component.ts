import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { BaseApiResponse } from 'src/app/utilities/api/base-api-response.model';
import { CreateUpdateCurrencyComponent } from '../../../dialogs/create-update-currency/create-update-currency.component';
import { CurrenciesService } from '../../../services/api/currencies.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthorityService } from 'src/app/features/shared/services/local/authority.service';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';
import { Store, select } from '@ngrx/store';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';

@UntilDestroy()
@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  public tableData!: MatTableDataSource<CurrencyModel>;
  
  public isLoading = true;
  public displayedColumns: string[] = ['name', 'code'];
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));

  public menuActions = [
    { icon: 'add', caption: 'Create Currency', action: (u: any) => this.createCurrency() },
    { icon: 'edit', caption: 'Update Currency', action: (u: any) => this.updateCurrency(u) },
    { icon: 'delete', caption: 'Delete Currency', action: (u: any) => this.deleteCurrency(u) },
  ]
  public allowActions: boolean = false;

  constructor(private currencyService: CurrenciesService,
    private authorityService: AuthorityService,
    public store: Store,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.tableData = new MatTableDataSource<CurrencyModel>([]);
    this.tableData.sort = this.sort;
    this.currencies$.pipe(untilDestroyed(this)).subscribe(e => {
      this.tableData.data = e
      this.isLoading = false;
    })

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

  createCurrency(){
    this.dialog
    .open(CreateUpdateCurrencyComponent, { data: {currency: undefined} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(currency => {
      if(currency) this._createCurrency(currency);
    });
  }

  private _createCurrency(currency: CurrencyModel){
    this.isLoading = true;

    this.currencyService.createCurrency(currency).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.message!, undefined, { duration: 1500 });
        this.isLoading = false;
        if(res.isSuccess) this.loadCurrencies();
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to create currency', error.message);
      },
    });
  }

  updateCurrency(model: CurrencyModel){
    if(!model) return;

    this.dialog
    .open(CreateUpdateCurrencyComponent, { data: {currency: model} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(currency => {
      if(currency) this._updateCurrency(currency);
    });
  }

  private _updateCurrency(currency: CurrencyModel){
    this.isLoading = true;

    this.currencyService.updateCurrency(currency).pipe(untilDestroyed(this)).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.message!, undefined, { duration: 1500 });
        this.isLoading = false;
        if(res.isSuccess) this.loadCurrencies();
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to update currency', error.message);
      },
    });
  }

  deleteCurrency(model: CurrencyModel){
    if(!model) return;
    
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this currency?',
      description: 'If you delete '+ model.code +' currency you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(isConfirmed) this._deleteCurrency(model);
    });
  }

  private _deleteCurrency(model: CurrencyModel) {
    this.isLoading = true;

    this.currencyService.deleteCurrency(model).pipe(untilDestroyed(this)).subscribe({
      next: (res: BaseApiResponse) => {
        this.snackBar.open(res.message!, undefined, { duration: 1500 });
        this.isLoading = false;
        if(res.isSuccess) this.loadCurrencies();
      },
      error: (error) => {
        console.error(error);

        this.displayError('Failed to delete currency', error.message);
      },
    });
  }

  private loadCurrencies(): void {
    this.currencyService.loadIntoStore().subscribe({
      error: (error) => {
        console.error(error);

        this.displayError('Failed to load currencies', error.message);
      },
    });
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
