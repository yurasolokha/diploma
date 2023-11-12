import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserModel } from 'src/app/features/shared/models/user.model';
import { AuthenticationService } from 'src/app/features/shared/services/local/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SetUserAction } from 'src/app/core/store/user/user.action';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loggingIn: boolean = false;
  public isFailed: boolean = false;

  public userInfo: FormGroup = new FormGroup({
    username: new FormControl(undefined, [Validators.required]),
    password: new FormControl(undefined, [Validators.required]),
  });

  constructor(
    private router: Router, 
    private authService: AuthenticationService,
    private userStore$: Store<UserModel>) {  }

  login(){
    if(this.userInfo.invalid) return;

    this.loggingIn = true;
    this.isFailed = false;

    this.authService
    .login(this.userInfo.controls['username'].value, this.userInfo.controls['password'].value)
    .pipe(untilDestroyed(this)).subscribe({
      complete: () => {
        this.authService.me(true).pipe(untilDestroyed(this)).subscribe(user => {
          if (!user) {
            this.loggingIn = false;
            this.isFailed = true;

            this.authService.logout();

            return;
          }

          this.userStore$.dispatch(new SetUserAction(user));

          this.router.navigate(['/']);
        });
      },
      error: (error) => {
        this.loggingIn = false;
        this.isFailed = true;
      },
    });
  }
}
