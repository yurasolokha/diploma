import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { CurrencyPaginationModel, CurrencyRatesFilter } from 'src/app/features/shared/models/currency-rates-filter.model';
import { FilterDataModel } from 'src/app/features/shared/models/filter-data.model';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store, select } from '@ngrx/store';
import { CurrencyHelper } from 'src/app/utilities/helpers/currency-store.helper';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';

@UntilDestroy()
@Component({
  selector: 'app-currency-rates-filter',
  templateUrl: './currency-rates-filter.component.html',
  styleUrls: ['./currency-rates-filter.component.scss']
})
export class CurrencyRatesFilterComponent implements OnInit {
  public form!: FormGroup;
  public appliedFilters!: FilterDataModel[];
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));
  private _filter!: CurrencyPaginationModel;

  @Input()set filter(value: CurrencyPaginationModel) {
    this._filter = value;

    if(!!this.form) {
      this.form.patchValue(this._filter)
    }

    this.showAppliedFilters(this._filter);
  }
  get filter() {
    return this._filter;
  }

  @Output() filterChange = new EventEmitter<CurrencyPaginationModel>();

  constructor(
    public store: Store,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.showAppliedFilters(this.filter);
  }

  private initForm() {
    this.form = new FormGroup({
      from: new FormControl(this.filter.from, [Validators.required]),
      to: new FormControl(this.filter.to, [Validators.required]),
      firstCurrency: new FormControl(this.filter.firstCurrency),
      secondCurrency: new FormControl(this.filter.secondCurrency),
      smoothFilter: new FormControl(this.filter.smoothFilter, [Validators.required]),
    });
  }

  resetFilter() {
    const filter = new CurrencyRatesFilter();
    this._filter = {...this._filter, ...filter};

    this.form.controls['from'].setValue(this.filter.from);
    this.form.controls['to'].setValue(this.filter.to);
    this.form.controls['firstCurrency'].setValue(this.filter.firstCurrency);
    this.form.controls['secondCurrency'].setValue(this.filter.secondCurrency);
    this.form.controls['smoothFilter'].setValue(this.filter.smoothFilter);

    this.applyFilter();
  }

  applyFilter(){
    if(!this.form.valid) return;
    
    const formValue = this.form.getRawValue();

    const filter: CurrencyRatesFilter = {
      from: formValue.from,
      to: formValue.to,
      firstCurrency: formValue.firstCurrency,
      secondCurrency: formValue.secondCurrency,
      smoothFilter: formValue.smoothFilter,
    };

    const newFilter = {...this._filter, ...filter}
    
    this.filterChange.emit(newFilter);
  }

  private showAppliedFilters(filter: CurrencyRatesFilter){
    this.appliedFilters = [];

    let from = moment(new Date(filter.from)).format(DataConvention.DateFormat);
    let to = moment(new Date(filter.to)).format(DataConvention.DateFormat);

    this.appliedFilters.push({id: 0, description: `${from} - ${to}`});
    this.appliedFilters.push({id: 0, description: `Smooth filter is ${filter.smoothFilter ? 'on' : 'off' }`});

    if(filter.firstCurrency){
      const currencyName = CurrencyHelper.findCurrency(this.currencies$, filter.firstCurrency)?.code;
      this.appliedFilters.push({id: 1, description: `First: ${currencyName}`});
    }

    if(filter.secondCurrency){
      const currencyName = CurrencyHelper.findCurrency(this.currencies$, filter.secondCurrency)?.code;
      this.appliedFilters.push({id: 2, description: `Second: ${currencyName}`});
    }
  }

  removeFilter(id: number){
    if(!id) return;
    
    if(id === 1){
      this.appliedFilters.splice(this.appliedFilters.findIndex(e => e.id === id), 1);
      this.form.controls['firstCurrency'].setValue(undefined);
    }
    else if(id === 2){
      this.appliedFilters.splice(this.appliedFilters.findIndex(e => e.id === id), 1);
      this.form.controls['secondCurrency'].setValue(undefined);
    }
    this.applyFilter();
  }

  changeDateDay(evt: any, control: string) {
    if(!this.form.controls[control]) return;

    const date = moment(this.form.controls[control].value);

    if(evt.deltaY < 0)
      this.form.controls[control].setValue(date.add(1, 'day').toDate());
    else if(evt.deltaY > 0)
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
    } else{
      this.form.controls['from'].setValue(from.subtract(1, 'month').toDate());
      this.form.controls['to'].setValue(to.subtract(1, 'month').toDate());
    }
  }

  swapCurrencies(){
    const first = this.form.controls['firstCurrency'].value;
    const second = this.form.controls['secondCurrency'].value;

    this.form.controls['firstCurrency'].setValue(second);
    this.form.controls['secondCurrency'].setValue(first);
  }
}
