import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'accounts', canActivate: [AuthGuard], loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule) }, 
  { path: 'classifiers', canActivate: [AuthGuard], loadChildren: () => import('./features/classifiers/classifiers.module').then(m => m.ClassifiersModule) },
  { path: 'currencies', canActivate: [AuthGuard], loadChildren: () => import('./features/currencies/currencies.module').then(m => m.CurrenciesModule) },
  { path: 'reports', canActivate: [AuthGuard], loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'admin-panel', canActivate: [AuthGuard], loadChildren: () => import('./features/admin-panel/admin-panel.module').then(m => m.AdminPanelModule) },
  { path: 'transactions', canActivate: [AuthGuard], loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule) },
  { path: 'auth', loadChildren: () => import('./features/authenticate/authenticate.module').then(m => m.AuthenticateModule) },
  { path: '', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },

  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
