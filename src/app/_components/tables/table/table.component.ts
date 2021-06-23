import {Component, Input, OnInit} from '@angular/core';
import {TableDataType} from "../table-data/table-data.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {

  @Input() classList: string;
  @Input() headers: {label: string, value: any}[];
  @Input() data: {type: TableDataType, content: any}[][];
  @Input() step: number;
  @Input() hasNavigation: boolean;
  @Input() defaultSort: number;
  @Input() defaultColumnSortIndex: number;
  @Input() loading: boolean;

  currentPage: number = 0;
  totalPages: number;

  sort: number;
  columnSortIndex: number;

  constructor() { }

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.data.length / this.step);
    this.sort = this.defaultSort;
    this.columnSortIndex = this.defaultColumnSortIndex;
  }

  divideIntoPages(): {type: TableDataType, content: any}[][] {
    if (this.currentPage === this.totalPages - 1) return this.data.slice(this.currentPage * this.step);
    return this.data.slice(this.currentPage * this.step, this.currentPage * this.step + this.step);
  }

  sortColumn(direction: number, columnIndex: number): void {
    console.log(direction)
    this.columnSortIndex = columnIndex;
    if (direction < 0 ) console.log("sort down")
    if (direction > 0 ) console.log("sort up")
    console.log(this.headers[columnIndex].label)
    // TODO: do sorting
    // FIXME: bug somewhere
  }

}
