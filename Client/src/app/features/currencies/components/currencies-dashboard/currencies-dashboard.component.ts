import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponentModel } from 'src/app/features/shared/component-models/card';

@Component({
  selector: 'app-currencies-dashboard',
  templateUrl: './currencies-dashboard.component.html',
  styleUrls: ['./currencies-dashboard.component.scss']
})
export class CurrenciesDashboardComponent implements OnInit {

  public loading = true;

  public readonly cards : CardComponentModel[] = [
    {
      headerCaption: 'Currencies list',
      headerIcon: 'attach_money',
      description: 'This module allows you to manage currencies and currency rates.',
      footerCaption: 'Currencies',
      link: 'currencies/list',
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loading = false;
  }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }
}
