import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuItemComponent } from './sidebar/menu-item/menu-item.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ClientsComponent } from './clients/clients.component';
import {SearchComponent} from "./navbar/search/search.component";
import {ThemeTogglerComponent} from "./navbar/theme-toggler/theme-toggler.component";
import {NotificationsComponent} from "./navbar/notifications/notifications.component";
import {ProfileComponent} from "./navbar/profile/profile.component";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../_components/shared.module";
import { BudgetsComponent } from './budgets/budgets.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './settings/account/account.component';
import {NgApexchartsModule} from "ng-apexcharts";
import { CustomizationComponent } from './settings/customization/customization.component';
import { SecurityComponent } from './settings/security/security.component';


@NgModule({
  declarations: [
    SidebarComponent,
    MenuItemComponent,
    PageNotFoundComponent,
    NavbarComponent,
    MainComponent,
    DashboardComponent,
    ProjectsComponent,
    StatisticsComponent,
    ClientsComponent,
    SearchComponent,
    ThemeTogglerComponent,
    NotificationsComponent,
    ProfileComponent,
    BudgetsComponent,
    SettingsComponent,
    AccountComponent,
    CustomizationComponent,
    SecurityComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        SharedModule,
        NgApexchartsModule
    ]
})
export class DashboardModule { }
