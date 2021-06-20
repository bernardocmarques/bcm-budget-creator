import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MainComponent} from "./main/main.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {ProjectsComponent} from "./projects/projects.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {ClientsComponent} from "./clients/clients.component";
import {CreateBudgetComponent} from "./budgets/create-budget/create-budget.component";
import {ManageBudgetsComponent} from "./budgets/manage-budgets/manage-budgets.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'main' },
      { path: 'main', component: MainComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'budgets/add', component: CreateBudgetComponent },
      { path: 'budgets/manage', component: ManageBudgetsComponent },
      { path: 'statistics', component: StatisticsComponent },
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
