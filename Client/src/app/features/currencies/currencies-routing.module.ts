import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrenciesDashboardComponent } from './components/currencies-dashboard/currencies-dashboard.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';

const routes: Routes = [
  { path: '', component: CurrenciesDashboardComponent },
  { path: 'list', component: CurrenciesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrenciesRoutingModule { }
