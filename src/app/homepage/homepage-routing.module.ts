import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {LoginComponent} from "./login/login.component";
import {CreateAccountComponent} from "./create-account/create-account.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {animation: 'ForgotPasswordPage'},
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {animation: 'LoginPage'}
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
    data: {animation: 'CreateAccountPage'}
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '404', pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
