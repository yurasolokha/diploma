import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponentModel } from 'src/app/features/shared/component-models/card';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public loading = true;

  public readonly cards : CardComponentModel[] = [
    {
      headerCaption: 'User Management',
      headerIcon: 'supervisor_account',
      description: 'This module allows you to manage users, companies, and roles defined in the default security realm.',
      footerCaption: 'Manage Users',
      link: 'admin-panel/user-management',
    },

    {
      headerCaption: 'Configuration',
      headerIcon: 'settings',
      description: 'Set system settings, such as date lock, classifier order, and more.',
      footerCaption: 'Manage Configuration',
      link: 'admin-panel/configuration',
    },

    {
      headerCaption: 'Data Import/Export',
      headerIcon: 'import_export',
      description: 'You can easily import external data into AbtoCash from old (AbyCash) database.',
      footerCaption: 'Import/Export Data',
      link: 'admin-panel/data-import-export',
    },

    {
      headerCaption: 'Access Management',
      headerIcon: 'supervisor_account',
      description: 'This module allows you to manage accesses.',
      footerCaption: 'Manage Accesses',
      link: 'admin-panel/access-management',
    },

    {
      headerCaption: 'Audit Log',
      headerIcon: 'supervisor_account',
      description: 'This module allows you view audit log.',
      footerCaption: 'Manage Audit',
      link: 'admin-panel/audit-log',
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
