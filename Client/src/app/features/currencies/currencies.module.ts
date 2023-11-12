import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenciesRoutingModule } from './currencies-routing.module';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { CurrenciesDashboardComponent } from './components/currencies-dashboard/currencies-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CurrencyListComponent } from './components/currencies/currency-list/currency-list.component';
import { CurrencyRatesComponent } from './components/currencies/currency-rates/currency-rates.component';
import { CurrencyRatesFilterComponent } from './components/currencies/currency-rates-filter/currency-rates-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CreateUpdateCurrencyComponent } from './dialogs/create-update-currency/create-update-currency.component';
import { CreateUpdateCurrencyRateComponent } from './dialogs/create-update-currency-rate/create-update-currency-rate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import { CrossCurrencyRatesComponent } from './dialogs/cross-currency-rates/cross-currency-rates.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CurrenciesComponent,
    CurrenciesDashboardComponent,
    CurrencyListComponent,
    CurrencyRatesComponent,
    CurrencyRatesFilterComponent,
    CreateUpdateCurrencyComponent,
    CreateUpdateCurrencyRateComponent,
    CrossCurrencyRatesComponent
  ],
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
  ]
})
export class CurrenciesModule { }
