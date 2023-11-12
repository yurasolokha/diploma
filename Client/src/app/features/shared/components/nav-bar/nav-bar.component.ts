import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUserFeature } from 'src/app/core/store/user/user.selectors';
import { ClassifiersService } from 'src/app/features/classifiers/services/api/classifiers.service';
import { AuthenticationService } from 'src/app/features/shared/services/local/auth.service';
import { ClassifierModel } from '../../models/classifier.model';
import { UserModel } from '../../models/user.model';
import { AuthorityService } from '../../services/local/authority.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Roles } from 'src/app/core/contracts/business-logic-configuration';

@UntilDestroy()
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public isActive: boolean = false;

  public user$: Observable<UserModel> = this.store$.pipe(select(selectUserFeature));

  private _menuItems = [
    {
      isExpanded: false,
      icon: 'dashboard',
      caption: 'Dashboard',
      link: '/',
      children: undefined
    },
    {
      isExpanded: false,
      icon: 'account_box',
      caption: 'Accounts',
      link: '/accounts',
      children: undefined
    },
    {
      isExpanded: false,
      icon: 'sync',
      caption: 'Transactions',
      link: '/transactions',
      children: undefined
    },
    {
      isClassifiers: true,
      isExpanded: false,
      icon: 'class',
      caption: 'Classifiers',
      link: '/classifiers',
      children: undefined
    },
    {
      isExpanded: false,
      icon: 'attach_money',
      caption: 'Currencies',
      link: '/currencies',
      children: [
        { link: '/currencies/list', caption: 'Currencies list' },
      ]
    },
    {
      isExpanded: false,
      icon: 'insert_chart',
      caption: 'Reports',
      link: '/reports',
      children: [
        { link: '/reports/accounts-balance', caption: 'Accounts balance' },
        { link: '/reports/financial-result', caption: 'Financial results' },
        { link: '/reports/currency-rates', caption: 'Currency rates' },
      ]
    },
  ];

  private _adminItems = [
    {
      isExpanded: false,
      icon: 'dns',
      caption: 'Admin Panel',
      link: '/admin-panel',
      children: [
        { link: '/admin-panel/user-management', caption: 'User Management' },
        { link: '/admin-panel/configuration', caption: 'System Configuration' },
        { link: '/admin-panel/data-import-export', caption: 'Data Import/Export' },
        { link: '/admin-panel/access-management', caption: 'Access Management' },
        {link: '/admin-panel/activity-log', caption: 'Activity Logs'},
      ]
    },
  ];

  public menuItems: any[] = [];

  constructor(
    private router: Router,
    private authorityService: AuthorityService, 
    private authService: AuthenticationService,
    private classifiersService: ClassifiersService,
    private store$: Store<UserModel>) { }

  ngOnInit(): void {
    this.menuItems = this.authorityService.currentUserIs(Roles.Admin)
      ? [...this._menuItems, ...this._adminItems]
      : [...this._menuItems];

    this.setClassifiers();
  }

  goto(item: any) {
    this.isActive = false;

    const link = [item.link];
    if(item.param) link.push(item.param);

    if(item.data) {
      this.router.navigate(link, { state: { data: item.data } });
      return;
    }

    this.router.navigate(link);
  }

  logout() {
    this.authService.logout();

    this.router.navigateByUrl('/auth/login');

    this.isActive = false;
  }

  private setClassifiers() {
    const item = this.menuItems.find(e => e.isClassifiers);

    this.classifiersService.getClassifiers().pipe(untilDestroyed(this)).subscribe({
      next: (classifiers: ClassifierModel[]) => {
        item!.children = classifiers.map(classifier => ({
          link: 'classifiers/classifier',
          param: classifier.id,
          caption: classifier.singularName,
          data: classifier
        }));
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
