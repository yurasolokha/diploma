import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { SharedModule } from '../shared/shared.module';
import { AccountsBalanceComponent } from './components/accounts-balance/accounts-balance.component';
import { CurrencyRatesComponent } from './components/currency-rates/currency-rates.component';
import { FinancialResultComponent } from './components/financial-result/financial-result.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [
    ReportsComponent,
    AccountsBalanceComponent,
    CurrencyRatesComponent,
    FinancialResultComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatTreeModule,
    GoogleChartsModule
  ]
})
export class ReportsModule { }
