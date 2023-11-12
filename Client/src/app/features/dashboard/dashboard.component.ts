import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponentModel } from '../shared/component-models/card';
import { AuthorityService } from '../shared/services/local/authority.service';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly _cards: CardComponentModel[] = [
    {
      headerCaption: 'Accounts',
      headerIcon: 'account_box',
      description: 'This module allows you to view and manage accounts.',
      footerCaption: 'View Accounts',
      link: 'accounts',
    },

    {
      headerCaption: 'Transactions',
      headerIcon: 'sync',
      description: 'This module allows you to view, export or manage transactions.',
      footerCaption: 'View Transactions',
      link: 'transactions',
    },

    {
      headerCaption: 'Categories',
      headerIcon: 'class',
      description: 'This module allows you to manage classifiers and categories.',
      footerCaption: 'View Categories',
      link: 'classifiers',
    },

    {
      headerCaption: 'Currencies',
      headerIcon: 'attach_money',
      description: 'This module allows you to view and manage currencies and currency rates.',
      footerCaption: 'View Currencies',
      link: 'currencies',
    },

    {
      headerCaption: 'Reports',
      headerIcon: 'insert_chart',
      description: 'This module allows you to generate reports.',
      footerCaption: 'Go To Reports',
      link: 'reports',
    },
  ];

  private readonly _adminCards: CardComponentModel[] = [
    {
      headerCaption: 'Admin panel',
      headerIcon: 'dns',
      description: 'This module allows you to manage users, roles, companies, block dates, adjust some settings.',
      footerCaption: 'Go To Admin Panel',
      link: 'admin-panel',
    },
  ];

  public cards!: CardComponentModel[];

  constructor(
    private readonly authorityService: AuthorityService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.cards = this.authorityService.currentUserIs(Roles.Admin)
      ? [ ...this._cards, ...this._adminCards ]
      : [ ...this._cards ];
  }

  goTo(link: string) {
    this.router.navigateByUrl(link);
  }
}
