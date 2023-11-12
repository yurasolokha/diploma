import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { AccountsService } from 'src/app/features/accounts/services/api/accounts.service';
import { CategoriesService } from 'src/app/features/classifiers/services/api/categories.service';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { ClassifierControl } from 'src/app/features/shared/models/classifier-contols.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { InteractableFilterDataModel } from 'src/app/features/shared/models/filter-data.model';
import { GroupByItem } from 'src/app/features/shared/models/group-by-item.model';
import { TransactionFilterModel } from 'src/app/features/shared/models/transaction-filter.model';
import { ClassifiersControlsHelper } from 'src/app/utilities/helpers/classifier-controls.helper';
import { ClassifiersGroupHelper } from 'src/app/utilities/helpers/classifiers-group.helper';
import { Guid } from 'src/app/utilities/types/guid';
import { TransactionsService } from '../../services/api/transactions.service';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransactionPaginationRequstModel } from 'src/app/features/shared/models/transaction-pagination.model';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';

@UntilDestroy()
@Component({
  selector: 'app-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  styleUrls: ['./transactions-filter.component.scss'],
})
export class TransactionsFilterComponent implements OnInit {
  _filter!: TransactionPaginationRequstModel;
  @Input() set filter(value:TransactionPaginationRequstModel) {
    this._filter = value;

    if(!!this.form) {
      this.form.patchValue(this._filter)
    }
    this.showAppliedFilters(this._filter);
  };

  get filter() {
    return this._filter;
  }

  @Output() filterChange = new EventEmitter<TransactionPaginationRequstModel>();

  public form!: FormGroup;
  public accounts!: AccountModel[];
  public transactionTypes!: string[];
  public classifiersDictionary: any = {};
  public classifierControls!: ClassifierControl[];
  public appliedFilters!: InteractableFilterDataModel[];

  isHidden = true;
  detailsPosition = { x: 0, y: 0 };
  accountFilterChanged = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountsService: AccountsService,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private classifierService: ClassifiersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAccounts();
    this.loadCategories();
    this.loadTypes();

    this.showAppliedFilters(this.filter);
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      from: [this.filter?.from, [Validators.required]],
      to: [this.filter?.to, [Validators.required]],
      comment: [this.filter?.comment],
      accounts: [this.filter?.accounts],
      allowedTypes: [this.filter?.allowedTypes],
    });
  }

  displayError(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel });
  }

  private loadTypes(): void {
    this.transactionsService
      .getTransactionTypes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.transactionTypes = response;
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load types', error.message);
        },
      });
  }

  private loadAccounts() {
    this.accountsService
      .getAccounts(new AccountFilterModel())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.accounts = response;
          const selectedAccountsControl = this.form.controls['accounts'];
          const loadedFilterAccounts = this.accounts.filter((account) =>
            (selectedAccountsControl.value as any[]).some(
              (e) => e.id === account.id
            )
          );
          this.filter.accounts = loadedFilterAccounts;
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load accounts', error.message);
        },
      });
  }

  private loadCategories() {

    this.classifierService.getClassifiers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (classifiers: ClassifierModel[]) => {
          this.classifierControls = ClassifiersControlsHelper.getControls(classifiers);
          
          this.classifierControls.forEach(control => {
            this.categoriesService.getCategoriesByClassifier(control.key.id)
              .pipe(untilDestroyed(this))
              .subscribe({
                next: (categories) => {
                  control.control.setValue(categories.filter(category => this.filter.categories.some(e => e.id == category.id)))
                  this.form.addControl(control.name, control.control);
                  this.classifiersDictionary = {...this.classifiersDictionary, [control.key.id.toString()]: categories}
                },
                error: (error) => {
                  console.error(error);
        
                  this.displayError('Failed to load categories', error.message);
                },
              })
          })
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to load classifier', error.message);
        },
      })
  }

  applyFilter() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const filter: TransactionFilterModel = {
      from: formValue.from,
      to: formValue.to,
      comment: formValue.comment,
      accounts: this.accounts.filter(account => (formValue.accounts as any[]).some(acc => acc.id === account.id)),
      allowedTypes: formValue.allowedTypes,
      categories: this.getCategoriesFromForm(),
    };

    const newFilter = {...this._filter, ...filter}

    this.filterChange.emit(newFilter);
  }

  categories(control: ClassifierControl) {
    return this.classifiersDictionary[control.key.id.toString()] as CategoryModel[];
  }

  private getCategoriesFromForm(): CategoryModel[] {
    if (!this.classifierControls) return [];

    return this.classifierControls
      .reduce((acc, cur) => {
        if (this.form.controls[cur.name].value)
          acc.push(this.form.controls[cur.name].value);
        return acc;
      }, [] as CategoryModel[])
      .flatMap((e: any) => e);
  }

  private showAppliedFilters(filter: TransactionFilterModel) {
    this.appliedFilters = [];

    const from = moment(new Date(filter.from)).format(
      DataConvention.DateFormat
    );
    const to = moment(new Date(filter.to)).format(DataConvention.DateFormat);

    this.appliedFilters.push({
      id: 0,
      description: `${from} - ${to}`,
      clickAction: () => {},
    });

    if (filter.accounts && filter.accounts.length) {
      this.appliedFilters.push({
        id: 1,
        description: `Accounts(${filter.accounts.length})`,
        clickAction: (e) => {
          this.isHidden = false;
          this.detailsPosition = { x: e.clientX, y: e.clientY };
        },
      });
    }

    if (filter.categories && filter.categories.length) {
      this.appliedFilters.push({
        id: 2,
        description: `Categories(${filter.categories.length})`,
        clickAction: () => {},
      });
    }

    if (filter.allowedTypes && filter.allowedTypes.length) {
      this.appliedFilters.push({
        id: 3,
        description: `Types(${filter.allowedTypes.length})`,
        clickAction: () => {},
      });
    }

    if (filter.comment) {
      this.appliedFilters.push({
        id: 4,
        description: `Comment: ${filter.comment}`,
        clickAction: () => {},
      });
    }
  }

  removeFilter(id: number) {
    let needRefresh = false;

    if (id === 1) {
      this.appliedFilters.splice(
        this.appliedFilters.findIndex((e) => e.id === id),
        1
      );
      this.form.controls['accounts'].setValue([]);
      needRefresh = true;
    } else if (id === 2) {
      this.appliedFilters.splice(
        this.appliedFilters.findIndex((e) => e.id === id),
        1
      );
      this.removeCategories();
      needRefresh = true;
    } else if (id === 3) {
      this.appliedFilters.splice(
        this.appliedFilters.findIndex((e) => e.id === id),
        1
      );
      this.form.controls['allowedTypes'].setValue([]);
      needRefresh = true;
    } else if (id === 4) {
      this.appliedFilters.splice(
        this.appliedFilters.findIndex((e) => e.id === id),
        1
      );
      this.form.controls['comment'].setValue(undefined);
      needRefresh = true;
    }

    if (needRefresh) this.applyFilter();
  }

  removeAccountFilter(accountId: any) {
    this.filter.accounts = this.filter.accounts.filter(
      (e) => e.id !== accountId
    );
    this.form.controls['accounts'].setValue(this.filter.accounts);
    this.accountFilterChanged = true;
  }

  detailsClosed() {
    this.isHidden = true;
    if (this.accountFilterChanged) {
      this.applyFilter();
      this.accountFilterChanged = false;
    }
  }

  private removeCategories(): void {
    this.classifierControls.forEach((control) => {
      this.form.controls[control.name].setValue([]);
    });
  }

  resetFilter() {
    const filter = new TransactionFilterModel();

    this.form.controls['from'].setValue(filter.from);
    this.form.controls['to'].setValue(filter.to);
    this.form.controls['accounts'].setValue(filter.accounts);
    this.form.controls['comment'].setValue(filter.comment);
    this.form.controls['allowedTypes'].setValue(filter.allowedTypes);

    this.removeCategories();
    this.applyFilter();
  }

  changeDateDay(evt: any, control: string) {
    if (!this.form.controls[control]) return;

    const date = moment(this.form.controls[control].value);

    if (evt.deltaY < 0)
      this.form.controls[control].setValue(date.add(1, 'day').toDate());
    else if (evt.deltaY > 0)
      this.form.controls[control].setValue(date.subtract(1, 'day').toDate());

    evt.preventDefault();
    evt.stopPropagation();
  }

  changeMonthPeriod(direction: any) {
    const from = moment(this.form.controls['from'].value);
    const to = moment(this.form.controls['to'].value);

    if (direction) {
      this.form.controls['from'].setValue(from.add(1, 'month').toDate());
      this.form.controls['to'].setValue(to.add(1, 'month').toDate());
    } else {
      this.form.controls['from'].setValue(from.subtract(1, 'month').toDate());
      this.form.controls['to'].setValue(to.subtract(1, 'month').toDate());
    }
  }

  formValueChange(propName: string, value: any) {
    this.form.controls[propName].setValue(value);
  }
}
