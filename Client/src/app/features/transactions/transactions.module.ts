import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionsFilterComponent } from './components/transactions-filter/transactions-filter.component';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TransactionCreateUpdateComponent } from './dialogs/transaction-create-update/transaction-create-update.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TransactionFileImportComponent } from './dialogs/transaction-file-import/transaction-file-import.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsFilterComponent,
    TransactionsListComponent,
    TransactionCreateUpdateComponent,
    TransactionFileImportComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
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
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    NgxMatDatetimePickerModule,
    MatSlideToggleModule,
  ]
})
export class TransactionsModule { }
