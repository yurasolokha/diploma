
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { DataConvention } from 'src/app/core/contracts/data.convention';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';
import { CurrenciesService } from 'src/app/features/currencies/services/api/currencies.service';
import { AccountFilterModel } from 'src/app/features/shared/models/account-filter.model';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { FilterDataModel } from 'src/app/features/shared/models/filter-data.model';

@UntilDestroy()
@Component({
  selector: 'app-account-filter',
  templateUrl: './account-filter.component.html',
  styleUrls: ['./account-filter.component.scss']
})
export class AccountFilterComponent implements OnInit {
  public form!: FormGroup;
  public appliedFilters: FilterDataModel[] = [];
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));
  
  private _filter!: AccountFilterModel;
  @Input() set filter(filter: AccountFilterModel) {
    this._filter = filter;
  }
  @Output() filterChange = new EventEmitter<AccountFilterModel>();

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.initForm();
    this.showAppliedFilters(this._filter);
  }

  private initForm() {
    this.form = new FormGroup({
      balanceDate: new FormControl(this._filter.balanceDate, [Validators.required]),
      balanceCurrency: new FormControl(this._filter.balanceCurrency),
    });
  }

  resetFilter() {
    this.form.controls['balanceDate'].setValue(new Date());
    this.form.controls['balanceCurrency'].setValue(undefined);

    this.applyFilter();
  }

  applyFilter(){
    if(!this.form.valid) return;

    this.showAppliedFilters(this.form.value);
    this.filterChange.emit(this.form.value);
  }

  private showAppliedFilters(filter: AccountFilterModel){
    this.appliedFilters = [];
    
    if(filter.balanceDate) {
      const date = moment(filter.balanceDate).format(DataConvention.DateFormat);
      this.appliedFilters.push({id: 1, description: date});
    }

    if(filter.balanceCurrency) {
      const currencyName = filter.balanceCurrency.code;
      this.appliedFilters.push({id: 2, description: `Currency: ${currencyName}`});
    }
  }

  removeFilter(id: number) {
    if(!id) return;
    
    if(id === 1){
      this.form.controls['balanceDate'].setValue(new Date());
    }
    else if(id === 2){
      this.appliedFilters.splice(this.appliedFilters.findIndex(e => e.id === id), 1);
      this.form.controls['balanceCurrency'].setValue(undefined);
    }

    this.applyFilter();
  }

  changeDateDay(evt: any, control: string) {
    if(!this.form.controls[control]) return;

    let date = moment(this.form.controls[control].value);

    if(evt.deltaY < 0)
      this.form.controls[control].setValue(date.add(1, 'day').toDate());
    else if(evt.deltaY > 0)
      this.form.controls[control].setValue(date.subtract(1, 'day').toDate());

    evt.preventDefault();
    evt.stopPropagation();
  }
}
