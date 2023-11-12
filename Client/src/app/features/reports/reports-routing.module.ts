import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsBalanceComponent } from './components/accounts-balance/accounts-balance.component';
import { CurrencyRatesComponent } from './components/currency-rates/currency-rates.component';
import { FinancialResultComponent } from './components/financial-result/financial-result.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'financial-result', component: FinancialResultComponent },
  { path: 'accounts-balance', component: AccountsBalanceComponent },
  { path: 'currency-rates', component: CurrencyRatesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
