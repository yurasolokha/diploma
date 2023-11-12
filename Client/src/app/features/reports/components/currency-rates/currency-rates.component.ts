import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CurrenciesService } from 'src/app/features/currencies/services/api/currencies.service';
import { CurrencyModel } from 'src/app/features/shared/models/currency.model';
import { CurrencyRateReportRequest } from 'src/app/features/shared/models/reports/currency-rate-report-request.model';
import { CurrencyRateReportModel } from 'src/app/features/shared/models/reports/currency-rate-report.model';
import { getDefaultFromTo } from 'src/app/utilities/defaults/form-defaults';
import { ReportsService } from '../../services/api/reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store, select } from '@ngrx/store';
import { selectCurrenciesFeature } from 'src/app/core/store/currency/currency.selectors';
import { ChartType } from 'angular-google-charts';
import { CurrencyRateReportItem } from 'src/app/features/shared/models/reports/currency-rate-report-item.model';

@UntilDestroy()
@Component({
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss'],
})
export class CurrencyRatesComponent implements OnInit {
  public isLoading: boolean = false;
  public goTo(link: string) {
    this.router.navigateByUrl(link);
  }

  public form!: FormGroup;
  public currencies$ = this.store.pipe(select(selectCurrenciesFeature));
  public chartData: any = {};

  constructor(
    private router: Router,
    private reportsService: ReportsService,
    public store: Store,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return inputValue.invalid && inputValue.dirty;
  }

  applyFilter() {
    if (this.form.invalid) return;

    const filter = this.getFilter();

    this.loadReport(filter);
  }

  private initForm() {
    const dates = getDefaultFromTo();

    this.form = new FormGroup({
      from: new FormControl(dates.from, [Validators.required]),
      to: new FormControl(dates.to, [Validators.required]),
      firstCurrency: new FormControl(undefined, [Validators.required]),
      secondCurrency: new FormControl(undefined, [Validators.required]),
    });
  }

  private loadReport(filter: CurrencyRateReportRequest) {
    filter.from.setDate(filter.from.getDate()-1);
    this.reportsService
      .getCurrencyRateReport(filter)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.drawReport(res as any, filter);
        },
        error: (error) => {
          console.error(error);

          if (error.message) {
            this.snackBar.open(error.message, undefined, { duration: 2000 });
          }
        },
      });
  }

  private getFilter() {
    const res = this.form.getRawValue();
    res.from = moment(res.from.getTime()).startOf('day').utc(true).toDate()
    res.to = moment(res.to.getTime()).startOf('day').utc(true).toDate()
    return res;
  }

  private drawReport(
    report: CurrencyRateReportModel,
    filter: CurrencyRateReportRequest
  ) {
    this.chartData.type = ChartType.SteppedAreaChart;
    this.chartData.title = 'Currency rate';
    this.chartData.columns = [
      { name: 'Date', type: 'date' },
      { name: 'Rate', type: 'number' },
    ];
    this.chartData.data = this.interpolate(report.rates, filter).map((e) => [
      this.removeOffset(e.date),
      e.rate,
    ]);
    this.chartData.options = {
      hAxis: {
        title: filter.firstCurrency.code + ' - ' + filter.secondCurrency.code,
      },
      vAxis: { title: '' },
      width: '100%',
      height: 500,
      backgroundColor: '#FBF9F5',
    };
  }

  private removeOffset(date: Date) {
    const cur = moment(Date.parse(date.toString()));
    cur.add(23, 'h');
    cur.add(59, 'minutes');
    cur.add(59, 's');

    return cur.toDate();
  }

  private interpolate(data: CurrencyRateReportItem[], filter: CurrencyRateReportRequest) {
    var res: CurrencyRateReportItem[] = [];
    var prevBalIndex = 0;

    for (var date = moment(filter.from.getTime()).startOf('day').toDate(); date <= filter.to; date.setDate(date.getDate()+1)) {
      if(date > new Date(data[prevBalIndex].date)) {
        prevBalIndex++;
      }

      res.push({date: new Date(date), rate: data[prevBalIndex].rate});
    }

    return res;
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
}
