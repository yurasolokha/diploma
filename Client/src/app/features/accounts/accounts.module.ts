import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './components/accounts-component/accounts.component';
import {MatSliderModule} from '@angular/material/slider';
import { AccountFilterComponent } from './components/accounts-component/components/account-filter/account-filter.component';
import { AccountListComponent } from './components/accounts-component/components/account-list/account-list.component';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';
import { CreateUpdateAccountComponent } from './components/accounts-component/dialogs/create-update-account/create-update-account.component';

@NgModule({
  declarations: [
    AccountsComponent,
    AccountFilterComponent,
    AccountListComponent,
    CreateUpdateAccountComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    MatSliderModule,
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
    MatTreeModule,
  ]
})
export class AccountsModule { }
