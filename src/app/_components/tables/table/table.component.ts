import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TableDataType} from "../table-data/table-data.component";
import {ThemeService} from "../../../_services/theme.service";
import 'datatables.net';

declare let $;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() classList: string;

  @Input() headers: {label: string, value: any}[];
  @Input() footers: string[];

  @Input() data: {type: TableDataType, content: any}[][];
  @Input() options: any;

  @Input() loading: boolean;

  @Input() itemsList: boolean;

  @Output() btnClicked: EventEmitter<{row: number, col: number}> = new EventEmitter<{row: number, col: number}>();
  @Output() viewBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() editBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteBtnClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() valueChanged: EventEmitter<{value: any, row: number, col: number}> = new EventEmitter();

  datatable: DataTables.Api;
  defaultOptions = {
    language: {
      info: 'Showing _START_-_END_ of _TOTAL_',
      paginate: {
        next: '<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>',
        previous: '<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>'
      }
    },
  };

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    if (!this.footers) this.footers = this.headers.map(header => header.label);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loading && !changes.loading.currentValue) this.buildDatatable();
    else if (!changes.loading && changes.data) this.buildDatatable();
  }

  buildDatatable(): void {
    if (this.datatable) this.datatable.destroy();
    const opts = this.options ? Object.assign(this.options, this.defaultOptions) : this.defaultOptions;
    setTimeout(() => {
      this.datatable = $('#' + this.id).DataTable(opts);

      // Change scrollbar style if dark
      if (this.themeService.isDark()) $('.dataTables_wrapper').addClass('scrollbar-dark scrollbar-table-dark');
    }, 0);
  }

}
