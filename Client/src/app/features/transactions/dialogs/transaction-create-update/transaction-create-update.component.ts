import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { AccountsService } from 'src/app/features/accounts/services/api/accounts.service';
import { CategoriesService } from 'src/app/features/classifiers/services/api/categories.service';
import { CurrencyRatesService } from 'src/app/features/currencies/services/api/currency-rates.service';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { AccountModel } from 'src/app/features/shared/models/account.model';
import { BlockedDateModel } from 'src/app/features/shared/models/blocked-date.model';
import { CategoryModel } from 'src/app/features/shared/models/category.model';
import { ClassifierControl } from 'src/app/features/shared/models/classifier-contols.model';
import { ClassifierModel } from 'src/app/features/shared/models/classifier.model';
import { CurrencyRateModel } from 'src/app/features/shared/models/currency-rate.model';
import { GroupByItem } from 'src/app/features/shared/models/group-by-item.model';
import { TransactionModel } from 'src/app/features/shared/models/transaction.model';
import { BlockedDatesService } from 'src/app/features/shared/services/api/blocked-dates.service';
import { ClassifiersControlsHelper } from 'src/app/utilities/helpers/classifier-controls.helper';
import { ClassifiersGroupHelper } from 'src/app/utilities/helpers/classifiers-group.helper';
import { Guid } from 'src/app/utilities/types/guid';
import { TransactionsService } from '../../services/api/transactions.service';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RegExes } from 'src/app/core/contracts/regexp.const';
import { NumberValidators } from 'src/app/features/shared/validators/number.validator';
import { ClassifierValidator } from 'src/app/features/shared/validators/classifier.validator';
import * as moment from 'moment';
import { TransactionType } from 'src/app/utilities/costants/transaction-type.constant';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';

@UntilDestroy()
@Component({
  templateUrl: './transaction-create-update.component.html',
  styleUrls: ['./transaction-create-update.component.scss'],
})
export class TransactionCreateUpdateComponent
  extends SimpleFormDialog
  implements OnInit
{
  public classifiersDictionary:any = {};
  public classifierControls!: ClassifierControl[];
  public transactionTypes!: string[];

  dateFilter = (d: Date | null): boolean => true;
  lockedDates!: BlockedDateModel[];
  lastRates!: CurrencyRateModel[];
  equalsAccounts!: boolean;
  accounts!: AccountModel[];

  privateCategoriesSelector = {} as any;

  dateRange: any;

  constructor(
    private blockedDatesService: BlockedDatesService,
    private accountsService: AccountsService,
    private currencyRatesService: CurrencyRatesService,
    private categoriesService: CategoriesService,
    private classifierService: ClassifiersService,
    private transactionsService: TransactionsService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    dialog: MatDialogRef<TransactionCreateUpdateComponent>
  ) {
    super(
      !data?.transaction?.id
        ? {
            isUpdate: false,
            headerCaption: 'Add Transaction',
            initForm: data?.transaction
              ? () => this.initFormFrom({...data.transaction, id: Guid.newGuid()})
              : () => this.initEmptyForm(),
          }
        : {
            isUpdate: true,
            headerCaption: `${ !data?.isDuplicate ? "Update" : "Duplicate" } Transaction`,
            initForm: () => this.initFormFrom(data.transaction),
          },
      dialog
    );

    this.map = this._map;
    this.dateRange = data.dateRange;
  }

  ngOnInit(): void {
    this.model.initForm();
    this.loadAccounts(new AccountFilterModel());
    this.lockDates();
    this.loadCategories();
    this.loadTypes();

    this.form.controls['type'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((e: string) => {
        const destination = this.form.controls['destinationAccount'];
        const currencyRate = this.form.controls['currentRate']
        if(e === TransactionType.Transfer) {
          if(this.form.value.currentRate == 0) {
            const recalculate = this.form.controls["recalculate"];
            recalculate.setValue(1);
          }
          destination.enable();
          currencyRate.enable();
          return;
        }
        currencyRate.setValue(0);
        
        this.form.controls['destinationAmount'].setValue(null);
        destination.setValue(null);
        destination.disable();
        currencyRate.disable();
      });

    this.form.controls['type'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        if (!!Object.keys(this.classifiersDictionary).length && !!this.classifierControls?.length) {
          this.classifierControls.forEach(control => {
            this.updateClassifierControl(control, (category: CategoryModel) =>
              category.types.includes(e)
            );
          })
        }
      });
    
    this.form.controls['account'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        const recalculate = this.form.controls["recalculate"];
        if (this.transferDifferentValues()) {
          this.onRecalculateChange({checked: recalculate.value} as any);
        }
      });
    
    this.form.controls['destinationAccount'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        const recalculate = this.form.controls["recalculate"];
        if (this.transferDifferentValues()) {
          this.onRecalculateChange({checked: recalculate.value} as any);
        }
      });
  }

  private initDestinationAccountValidatorState() {
    const destination = this.form.controls['destinationAccount'];
    if(this.form.value.type === TransactionType.Transfer) {
      destination.enable();
      return;
    }
    destination.disable();
  }

  private initEmptyForm() {
    this.form = new FormGroup({
      currentRate: new FormControl({value: undefined, disabled: true}, [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]),
      recalculate: new FormControl(1),

      id: new FormControl(Guid.newGuid()),
      user: new FormControl(undefined),
      type: new FormControl(TransactionType.Expense, [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      amount: new FormControl(undefined, [Validators.required,
        Validators.pattern(RegExes.NumberRegExp)]),
      account: new FormControl(undefined, [Validators.required]),
      destinationAmount: new FormControl(undefined, [Validators.pattern(RegExes.NumberRegExp)]),
      destinationAccount: new FormControl(undefined, [Validators.required]),
      isExecuted: new FormControl(true, [Validators.required]),
      comment0: new FormControl(undefined, [Validators.maxLength(256)]),
      comment1: new FormControl(undefined, [Validators.maxLength(256)]),
    });
    this.initDestinationAccountValidatorState();
  }

  private initFormFrom(transaction: TransactionModel) {
    var rate = 0;
    if(!!transaction.amount && !!transaction.destinationAmount) {
      rate = Math.abs(transaction.destinationAmount / transaction.amount);
    }
    this.form = new FormGroup({
      currentRate: new FormControl(
        {
          value: rate,
          disabled: !rate,
        },
        [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]
      ),
      recalculate: new FormControl(!this.model.isUpdate),

      id: new FormControl(transaction.id),
      user: new FormControl(transaction.user),
      type: new FormControl(transaction.type, [Validators.required]),
      date: new FormControl(transaction.date, [Validators.required]),
      amount: new FormControl(
        transaction.type === TransactionType.Income
          ? transaction?.amount
          : -transaction?.amount,
        [Validators.required, Validators.pattern(RegExes.NumberRegExp)]
      ),
      account: new FormControl(transaction.account, [Validators.required]),
      destinationAmount: new FormControl(transaction.destinationAmount, [
        Validators.pattern(RegExes.NumberRegExp),
      ]),
      destinationAccount: new FormControl(transaction.destinationAccount, [
        Validators.required,
      ]),
      isExecuted: new FormControl(transaction.isExecuted, [
        Validators.required,
      ]),
      comment0: new FormControl(transaction.comment0, [
        Validators.maxLength(256),
      ]),
      comment1: new FormControl(transaction.comment1, [
        Validators.maxLength(256),
      ]),
    });
    this.initDestinationAccountValidatorState();
    if(this.transferDifferentValues() && !this.model.isUpdate) {
      this.onRecalculateChange({checked: true} as any);
    }
  }

  private _map(form: FormGroup): TransactionModel {
    const formValue = this.form.getRawValue();

    return {
      id: formValue.id,
      user: formValue.user,
      type: formValue.type,
      date: formValue.date,
      amount: +formValue.amount,
      account: formValue.account,
      isExecuted: formValue.isExecuted,
      comment0: formValue.comment0,
      comment1: formValue.comment1,
      categories: this.getCategoriesFromForm(),
      destinationAmount: this.transferDifferentValues()
        ? +formValue.destinationAmount
        : +formValue.amount,
      destinationAccount: formValue.destinationAccount,
      balance: 0,
      destinationBalance: 0,
    };
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];
    
    return inputValue?.invalid && inputValue?.dirty;
  }

  DateLockValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return inputValue.hasError('matDatetimePickerFilter');
  }

  InputNumberValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];
    let isNumber = !isNaN(Number(inputValue.value));
    return (inputValue.invalid && inputValue.dirty) || !isNumber;
  }

  formValueChange(propName: string, value: any) {
    this.form.controls[propName].setValue(value);
  }

  displayError(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    this.matDialog.open(ConfirmationDialogComponent, { data: dialogModel });
  }

  onAmountChange(event: any, control: string) {
    if (!this.transferDifferentValues()) return;

    if (control === 'amount')
      this.form.controls['amount'].setValue(
        this.form.controls['destinationAmount'].value /
          this.form.controls['currentRate'].value
      );
    else
      this.form.controls['destinationAmount'].setValue(
        this.form.controls['amount'].value *
          this.form.controls['currentRate'].value
      );
  }

  onRecalculateChange(event: MatCheckboxChange) {
    if (event.checked) {
      const formData = this.form.getRawValue();

      this.currencyRatesService
        .getLastCurrencyRate({
          firstCurrency: formData.account?.currency?.id,
          secondCurrency: formData.destinationAccount?.currency?.id,
        })
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: CurrencyRateModel) => {
            this.form.controls['currentRate'].setValue(res.rate);
            this.onAmountChange(event, 'destinationAmount');
            this.form.controls['currentRate'].disable();
          },
          error: (error) => {
            this.form.controls["recalculate"].setValue(0);
            this.form.controls['currentRate'].setValue(undefined);
            this.form.controls['currentRate'].enable();
          }
        });
      return;
    }
    this.form.controls['currentRate'].enable();
  }

  private initializeRates(): void {
    this.currencyRatesService
      .getLastCurrencyRates()
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: CurrencyRateModel[]) => {
          this.lastRates = res;
        },
        (error) => {
          console.error(error);

          this.displayError('Failed to initialize rates', error.message);
        }
      );
  }

  getPicker(picker: any) {
    return picker;
  }

  private lockDates(): void {
    this.blockedDatesService
      .getBlockedDates()
      .pipe(untilDestroyed(this))
      .subscribe({
          next: (res: any) => {
            this.lockedDates = (res as any[]).map(e => ({...e, dateFrom: moment(e.dateFrom).startOf('day'), dateTo: moment(e.dateTo).startOf('day')}));
            
          this.dateFilter = (date: Date | null): boolean =>
            !this.lockedDates.some(
                (e) => {
                  return e.dateFrom <= date! && e.dateTo >= date!
                }
            );
        },
          error: (error) => {
          console.log(error);

            this.displayError('Failed to lock dates', error.message);
          }
        }
      );
  }

  loadAccounts(filter: AccountFilterModel) {
    this.accountsService
      .getAccounts(filter)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.accounts = res;
        },
        error: (error) => {
          console.error(error);

          this.displayError('Failed to lock accounts', error.message);
        },
      });
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

  transferDifferentValues(): boolean {
    const formData = this.form.getRawValue();

    return (
      formData.type === TransactionType.Transfer &&
      formData.account?.currency?.code &&
      formData.destinationAccount?.currency?.code &&
      formData.account?.currency?.code !==
        formData.destinationAccount?.currency?.code
    );
  }

  public dateOutOfRange(): boolean {
    return (
      this.dateRange &&
      (this.dateRange[0] > this.form.value.date ||
        this.dateRange[1] < this.form.value.date)
    );
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
                  this.form.addControl(control.name, control.control);
                  this.classifiersDictionary = {...this.classifiersDictionary, [control.key.id.toString()]: categories}
      
                  this.updateClassifierControl(control, (category: CategoryModel) =>
                    category.types.includes(
                      this.form.getRawValue().type ?? TransactionType.Expense
                    )
                  );
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

  private updateClassifierControl(control: ClassifierControl, filter?: (item: any) => boolean) {
    let categories = this.classifiersDictionary[control.key.id.toString()] as CategoryModel[];
    
    if (!!filter && !!categories) {
      categories = categories?.filter(filter);
    }

    this.privateCategoriesSelector[control.key.id.toString()] = categories;
    
    if (!categories?.some((category) => control.control.value == category)) {
      control.control.setValue(null);
    }

    if (!categories?.length) {
      control.control.disable();
    } else {
      control.control.enable();
    }
  
  }

  public filterDisabledClassifierControls(
    classifierControls: ClassifierControl[]
  ) {
    return classifierControls?.filter((control) => !control.control.disabled);
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

  categories(control: ClassifierControl) {
    return this.privateCategoriesSelector[control.key.id.toString()] as CategoryModel[];
  }
}
