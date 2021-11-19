import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "./card/card.component";
import { TableComponent } from './tables/table/table.component';
import { TableDataComponent } from './tables/table-data/table-data.component';
import { PaginationComponent } from './tables/pagination/pagination.component';
import { BtnSortComponent } from './buttons/btn-sort/btn-sort.component';
import {InputTextComponent} from "./inputs/general/input-text/input-text.component";
import {FormsModule} from "@angular/forms";
import { InputToggleComponent } from './inputs/toggle/input-toggle/input-toggle.component';
import { SpinnerComponent } from './spinner/spinner/spinner.component';
import {RouterModule} from "@angular/router";
import { ModalComponent } from './modals/modal/modal.component';
import {ClickOutsideDirective} from "../_directives/click-outside.directive";
import {InputSelectComponent} from "./inputs/select/input-select/input-select.component";
import {InputNumberComponent} from "./inputs/general/input-number/input-number.component";
import {InputEmailComponent} from "./inputs/personal info/input-email/input-email.component";
import { InputCountryComponent } from './inputs/select/input-country/input-country.component';


@NgModule({
  declarations: [
    CardComponent,
    TableComponent,
    TableDataComponent,
    PaginationComponent,
    BtnSortComponent,
    InputTextComponent,
    InputNumberComponent,
    InputEmailComponent,
    InputToggleComponent,
    InputSelectComponent,
    SpinnerComponent,
    ModalComponent,
    ClickOutsideDirective,
    InputCountryComponent,
  ],
  exports: [
    CardComponent,
    TableComponent,
    InputTextComponent,
    InputNumberComponent,
    InputToggleComponent,
    SpinnerComponent,
    ModalComponent,
    InputSelectComponent,
    InputCountryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule { }
