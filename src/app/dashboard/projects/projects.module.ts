import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import {MainComponent} from "./main/main.component";
import {AddEditComponent} from "./add-edit/add-edit.component";
import {SharedModule} from "../../_components/shared.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [MainComponent, AddEditComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ProjectsModule { }
