import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsRoutingModule } from './budgets-routing.module';
import { MainComponent } from "./main/main.component";
import { AddEditComponent } from './add-edit/add-edit.component';
import { ViewComponent } from './view/view.component';
import {SharedModule} from "../../_components/shared.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MainComponent,
    AddEditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    BudgetsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class BudgetsModule { }
