import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LoggedInGuard} from "./_guards/logged-in.guard";

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
    canActivate: [LoggedInGuard],
    canActivateChild: [LoggedInGuard]
  },
  {
    path: '',
    loadChildren: () => import('./homepage/homepage.module').then(mod => mod.HomepageModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
