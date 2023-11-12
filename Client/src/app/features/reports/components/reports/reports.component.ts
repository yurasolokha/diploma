import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponentModel } from 'src/app/features/shared/component-models/card';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  public readonly cards : CardComponentModel[] = [
    {
      headerCaption: 'Accounts balance',
      headerIcon: 'account_balance',
      description: 'The Accounts Balance report shows a snapshot of the balances of each nominal ledger account at a point of time.',
      footerCaption: 'Accounts balance report',
      link: 'reports/accounts-balance',
    },

    {
      headerCaption: 'Financial results',
      headerIcon: 'pie_chart',
      description: 'Financial results are filtered and grouped according to a certain criterion in a certain period of time',
      footerCaption: 'Financial results report',
      link: 'reports/financial-result',
    },

    {
      headerCaption: 'Currency rates',
      headerIcon: 'attach_money',
      description: 'Representation of the relative price performance of a currency pair or pairs.',
      footerCaption: 'Currency rates report',
      link: 'reports/currency-rates',
    },
  ];


  constructor(private router: Router) { }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }
}
