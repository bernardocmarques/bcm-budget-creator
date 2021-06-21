import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "./card/card.component";
import { TableComponent } from './tables/table/table.component';
import { TableDataComponent } from './tables/table-data/table-data.component';
import { PaginationComponent } from './tables/pagination/pagination.component';
import { BtnSortComponent } from './buttons/btn-sort/btn-sort.component';
import {InputTextComponent} from "./inputs/general/input-text/input-text.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CardComponent,
    TableComponent,
    TableDataComponent,
    PaginationComponent,
    BtnSortComponent,
    InputTextComponent
  ],
  exports: [
    CardComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
