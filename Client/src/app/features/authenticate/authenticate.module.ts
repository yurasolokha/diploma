import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AuthenticateComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthenticateRoutingModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class AuthenticateModule { }
