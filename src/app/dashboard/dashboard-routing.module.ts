import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashboardComponent} from "./dashboard/dashboard.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {SettingsComponent} from "./settings/settings.component";
import {AccountComponent} from "./settings/account/account.component";
import {CustomizationComponent} from "./settings/customization/customization.component";
import {SecurityComponent} from "./settings/security/security.component";
import {NotificationsComponent} from "./settings/notifications/notifications.component";
import {MainComponent} from "./main/main.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'main' },
      { path: 'main', component: MainComponent },
      {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then(mod => mod.ClientsModule),
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(mod => mod.ProjectsModule),
      },
      {
        path: 'budgets',
        loadChildren: () => import('./budgets/budgets.module').then(mod => mod.BudgetsModule),
      },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'settings',
        component: SettingsComponent,
        children: [
          { path: 'customization', component: CustomizationComponent },
          { path: 'account', component: AccountComponent },
          { path: 'security', component: SecurityComponent },
          { path: 'notifications', component: NotificationsComponent }
        ] },
      { path: '404', component: PageNotFoundComponent },
      { path: '**', redirectTo: '404', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
