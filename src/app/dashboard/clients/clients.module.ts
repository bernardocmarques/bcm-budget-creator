import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import {AddEditComponent} from "./add-edit/add-edit.component";
import {MainComponent} from "./main/main.component";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../_components/shared.module";


@NgModule({
  declarations: [MainComponent, AddEditComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class ClientsModule { }
