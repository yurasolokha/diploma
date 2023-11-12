import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { RegExes } from 'src/app/core/contracts/regexp.const';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { BlockedDateModel } from 'src/app/features/shared/models/blocked-date.model';
import { CurrencyRateModel } from 'src/app/features/shared/models/currency-rate.model';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { BlockedDatesService } from 'src/app/features/shared/services/api/blocked-dates.service';
import { NumberValidators } from 'src/app/features/shared/validators/number.validator';
import { CurrencyHelper } from 'src/app/utilities/helpers/currency-store.helper';

@UntilDestroy()
@Component({
  templateUrl: './create-update-currency-rate.component.html',
  styleUrls: ['./create-update-currency-rate.component.scss']
})
export class CreateUpdateCurrencyRateComponent extends SimpleFormDialog implements OnInit {
  private readonly id: any;
  
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));
  lockedDates!: BlockedDateModel[];
  dateFilter = (d: Date | null): boolean => true;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, dialog: MatDialogRef<CreateUpdateCurrencyRateComponent>, public store: Store, private blockedDatesService: BlockedDatesService,) {
    super( !data.currencyRate ? {
      isUpdate: false,
      headerCaption: 'Add New Currency Rate',
      initForm: () => this.initEmptyForm()
    } : {
      isUpdate: true,
      headerCaption: `Update Currency Rate ${data.currencyRate.firstCurrency.code} - ${data.currencyRate.secondCurrency.code}`,
      initForm: () => this.initFormFrom(data.currencyRate)
    }, dialog);

    this.map = this._map;
    this.id = data.currencyRate ? data.currencyRate.id : undefined;
  }

  ngOnInit(): void {
    this.model.initForm();
    this.lockDates();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return (inputValue.invalid && inputValue.dirty);
  }

  DateLockValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];
    
    return inputValue.hasError('matDatepickerFilter')
  }

  private initEmptyForm() {
    this.form = new FormGroup({
      date: new FormControl(new Date(), [Validators.required]),
      firstCurrency: new FormControl(undefined, [Validators.required]),
      secondCurrency: new FormControl(undefined, [Validators.required]),
      firstRate: new FormControl(1, [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]),
      secondRate: new FormControl(1, [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]),
    });
  }

  private initFormFrom(currencyRate: CurrencyRateModel) {
    this.form = new FormGroup({
      date: new FormControl(currencyRate.date, [Validators.required]),
      firstCurrency: new FormControl(CurrencyHelper.findCurrency(this.currencies$, currencyRate.firstCurrency.id), [Validators.required]),
      secondCurrency: new FormControl(CurrencyHelper.findCurrency(this.currencies$, currencyRate.secondCurrency.id), [Validators.required]),
      firstRate: new FormControl(1, [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]),
      secondRate: new FormControl(currencyRate? currencyRate.rate : 1, [Validators.required, Validators.pattern(RegExes.PositiveOnlyNumberRegExp), NumberValidators.isGreaterThen(0)]),
    });
  }

  private _map(form: FormGroup): CurrencyRateModel{
    return {
      id: this.id,
      date: form.value.date,
      firstCurrency: form.value.firstCurrency,
      secondCurrency: form.value.secondCurrency,
      rate: form.value.secondRate / form.value.firstRate,
    }
  }

  swapCurrencies(){
    const first = this.form.controls['firstCurrency'].value;
    const second = this.form.controls['secondCurrency'].value;

    const firstRate = this.form.controls['firstRate'].value;
    const secondRate = this.form.controls['secondRate'].value;

    this.form.controls['firstCurrency'].setValue(second);
    this.form.controls['secondCurrency'].setValue(first);

    this.form.controls['firstRate'].setValue(secondRate);
    this.form.controls['secondRate'].setValue(firstRate);
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
          }
        }
      );
  }
}
