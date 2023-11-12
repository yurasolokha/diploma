import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SetUserAction } from './core/store/user/user.action';
import { UserModel } from './features/shared/models/user.model';
import { AuthenticationService } from './features/shared/services/local/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ImportsNotificationsService } from './features/shared/services/signalR/imports-signalR.service';
import { ConfirmationDialogModel } from './features/shared/dialog-models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from './features/shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    public userStore$: Store<UserModel>,
    public store: Store,
    private router: Router, private matDialog: MatDialog,
    private notifications: ImportsNotificationsService
  ) {}

  ngOnInit(): void {
    // Close any opened dialog when route changes
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationStart),
    ).subscribe(() => this.matDialog.closeAll())
    
    if(this.authenticationService.isLoggedIn()){
      this.authenticationService.me(true).pipe(untilDestroyed(this)).subscribe(user => {
        this.userStore$.dispatch(new SetUserAction(user));
      });
      this.notifications.onImport.subscribe(e => {
        this.displayDialog("Import State Info", (e as any).message);
      })
    }
  }

  isLogged(state: any) { 
    return !!state.user.id;
  }

  isLoginPage() {
    return location.pathname === '/auth/login'
  }

  displayDialog(header: string, description: string) {
    const dialogModel: ConfirmationDialogModel = {
      header: header,
      description: description,
    };

    return this.matDialog.open(ConfirmationDialogComponent, { width: "700px", data: dialogModel });
  }
}
