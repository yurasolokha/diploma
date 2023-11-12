import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogModel } from 'src/app/features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from 'src/app/features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CompanyModel } from 'src/app/features/shared/models/company.model';
import { RoleModel } from 'src/app/features/shared/models/role.model';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { CompaniesService } from 'src/app/features/shared/services/api/companies.service';
import { CreateUpdateCompanyComponent } from '../../dialogs/create-update-company/create-update-company.component';
import { CreateUpdateRoleComponent } from '../../dialogs/create-update-role/create-update-role.component';
import { CreateUpdateUserComponent } from '../../dialogs/create-update-user/create-update-user.component';
import { RolesService } from '../../services/roles.service';
import { UsersService } from '../../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatSort) usersSort!: MatSort;
  
  public isLoading = true;

  public roles: any[] = [];
  public companies: any[] = [];
  public users: UserModel[] = [];

  public usersData: MatTableDataSource<UserModel> = new MatTableDataSource();

  public readonly rolesTableColumns = [ 'role' ];
  public readonly companiesTableColumns = [ 'company' ];
  public readonly userTableColumns = [ 'image', 'fullName', 'userName', 'email', 'role', 'company' ];

  public userMenuActions = [
    { icon: 'add', caption: 'Register New User', action: (u: any) => this.createUser(u) },
    { icon: 'edit', caption: 'Update User', action: (u: any) => this.updateUser(u) },
    { icon: 'delete', caption: 'Delete User', action: (u: any) => this.deleteUser(u) },
  ]

  public companiesMenuActions = [
    { icon: 'add', caption: 'Create New Company', action: (u: any) => this.createCompany(u) },
    { icon: 'edit', caption: 'Update Company', action: (u: any) => this.updateCompany(u) },
    { icon: 'delete', caption: 'Delete Company', action: (u: any) => this.deleteCompany(u) },
  ]

  public rolesMenuActions = [
    { icon: 'add', caption: 'Create New Role', action: (u: any) => this.createRole(u) },
    { icon: 'edit', caption: 'Update Role', action: (u: any) => this.updateRole(u) },
    { icon: 'delete', caption: 'Delete Role', action: (u: any) => this.deleteRole(u) },
  ]

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private rolesService: RolesService,
    private companiesService: CompaniesService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCompanies();
    this.loadRoles();
  }

  displayError(header: string, description: string){
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };
    
    this.dialog.open(ConfirmationDialogComponent, { data: dialogModel }) 
  }

  private loadUsers(){
    this.usersService.getUsers()
    .pipe(untilDestroyed(this)).subscribe({
      next: (res: UserModel[] | unknown) => {
        this.users = res as UserModel[];

        this.usersData = new MatTableDataSource(this.users);
        this.usersData.sort = this.usersSort;
        this.usersData.sortingDataAccessor = this.usersSortLogic;

        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);

        this.displayError('Failed to load users', error.message ?? '');
      },
    });
  }

  private loadCompanies(){
    this.companiesService.getCompanies()
    .pipe(untilDestroyed(this)).subscribe({
      next: (res: CompanyModel[] | unknown) => {
        this.companies = res as CompanyModel[];
      },
      error: (error: any) => {
        console.log(error);

        this.displayError('Failed to load companies', error.message ?? '');
      },
    });
  }

  private loadRoles(){
    this.rolesService.getRoles()
    .pipe(untilDestroyed(this)).subscribe({
      next: (res: RoleModel[] | unknown) => {
        this.roles = res as RoleModel[];
      },
      error: (error) => {
        console.log(error);

        this.displayError('Failed to load roles', error.message ?? '');
      },
    });
  }

  private usersSortLogic(user: any, prop: any){
    switch(prop)
    {
      case 'role': 
      case 'company': return user[prop].name;
      case 'fullName': return `${user.firstName} ${user.middleName} ${user.lastName}`;
      default: return user[prop];
    }
  }

  getFullName(user: UserModel){ return `${user.firstName} ${user.middleName} ${user.lastName}`; }

  goTo(link: string){
    this.router.navigateByUrl(link);
  }

  updateUser(user: any) {
    if(!user) return;
    this.dialog
    .open(CreateUpdateUserComponent, { data: {user: user, companies: this.companies, roles: this.roles} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(newUserData => {
      if(!newUserData) return;

      this.usersService.updateUser(newUserData).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadUsers();
        },
        error: (error) => { 
          console.error(error);
          
          this.displayError('Failed to update user', error.message ?? '');
        }
      });
    });
  }

  createUser(user: any) {
    this.dialog
    .open(CreateUpdateUserComponent, { data: {user: undefined, companies: this.companies, roles: this.roles} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(newUserData => {
      if(!newUserData) return;
      
      this.usersService.createNewUser(newUserData).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadUsers();
        },
        error: (error) => { 
          console.error(error); 

          this.displayError('Failed to create user', error.message ?? '');
        }
      });
    });
  }

  deleteUser(user: any){
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this user?',
      description: 'If you delete this user you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(!isConfirmed) return;
      
      this.usersService.deleteUser(user).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadUsers();
        },
        error: (error) => { 
          console.error(error); 

          this.displayError('Failed to delete user', error.message ?? '');
        }
      });
    });
  }

  updateCompany(company: any){
    this.dialog
    .open(CreateUpdateCompanyComponent, { data: {company: company} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(company => {
      if(!company) return;

      this.companiesService.updateCompany(company).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadCompanies();
        },
        error: (error) => { 
          console.error(error);
          
          this.displayError('Failed to update company', error.message ?? '');
        }
      });
    });
  }

  createCompany(company: any){
    this.dialog
    .open(CreateUpdateCompanyComponent, { data: {company: undefined} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(company => {
      if(!company) return;

      this.companiesService.createCompany(company).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadCompanies();
        },
        error: (error) => { 
          console.error(error); 

          this.displayError('Failed to create company', error.message ?? '');
        }
      });
    });
  }

  deleteCompany(company: any){
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this company?',
      description: 'If you delete this company you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(!isConfirmed) return;

      this.companiesService.deleteCompany(company).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadCompanies();
        },
        error: (error) => { 
          console.error(error);

          this.displayError('Failed to delete company', error.message ?? '');
        }
      });
    });
  }

  updateRole(role: any){
    this.dialog
    .open(CreateUpdateRoleComponent, { data: {role: role} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(role => {
      if(!role) return;

      this.rolesService.updateRole(role).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadRoles();
        },
        error: (error) => { 
          console.error(error); 

          this.displayError('Failed to update role', error.message ?? '');
        }
      });
    });
  }

  createRole(role: any){
    this.dialog
    .open(CreateUpdateRoleComponent, { data: {role: undefined} })
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(role => {
      if(!role) return;

      this.rolesService.createRole(role).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadRoles();
        },
        error: (error) => { 
          console.error(error);
          
          this.displayError('Failed to create role', error.message ?? '');
        }
      });
    });
  }

  deleteRole(role: any){
    const dialogModel: ConfirmationDialogModel = {
      header: 'Are you sure delete this role?',
      description: 'If you delete this role you can`t recover it.',
    };

    this.dialog
    .open(ConfirmationDialogComponent, {data: dialogModel})
    .afterClosed()
    .pipe(untilDestroyed(this)).subscribe(isConfirmed => {
      if(!isConfirmed) return;

      this.rolesService.deleteRole(role).pipe(untilDestroyed(this)).subscribe({
        next: (res: any) => { 
          if(res.isSuccess) this.loadRoles();
        },
        error: (error) => { 
          console.error(error); 

          this.displayError('Failed to delete role', error.message ?? '');
        }
      });
    });
  }

  public menuTopLeftPosition =  {x: '0', y: '0'}
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger!: MatMenuTrigger;
  onRightClick(event: MouseEvent, item: any, actions: any) {
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.matMenuTrigger.menuData = { item: { actions: actions, data: item } }

    this.matMenuTrigger.openMenu();
  }
}
