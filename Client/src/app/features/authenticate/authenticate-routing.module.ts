import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { 
    path: '',
    component: AuthenticateComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateRoutingModule { }
