import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableDataType} from "../table-data/table-data.component";
import {ThemeService} from "../../../_services/theme.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {

  @Input() id: string;
  @Input() classList: string;
  @Input() headers: {label: string, value: any}[];
  @Input() data: {type: TableDataType, content: any}[][];

  @Input() step: number;
  @Input() hasNavigation: boolean;

  @Input() defaultSort: number;
  @Input() defaultColumnSortIndex: number;

  @Input() loading: boolean;

  @Input() itemsList: boolean;

  @Output() btnClicked: EventEmitter<{row: number, col: number}> = new EventEmitter<{row: number, col: number}>();
  @Output() viewBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() editBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueChanged: EventEmitter<{value: any, row: number, col: number}> = new EventEmitter();

  currentPage: number = 0;
  totalPages: number;

  sort: number;
  columnSortIndex: number;

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    this.totalPages = this.step && this.hasNavigation ? Math.ceil(this.data.length / this.step) : this.data.length;
    this.sort = this.defaultSort;
    this.columnSortIndex = this.defaultColumnSortIndex;
  }

  divideIntoPages(): {type: TableDataType, content: any}[][] {
    if (!this.step || !this.hasNavigation) return this.data;
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
