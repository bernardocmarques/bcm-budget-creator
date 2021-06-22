import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../_components/tables/table-data/table-data.component";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styles: [
  ]
})
export class BudgetsComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];

  idInput: number;
  clientInput: string;
  projectInput: string;
  statusInput: string;

  constructor() { }

  ngOnInit(): void {
    this.headers = [
      {label: 'client', value: this.clientInput},
      {label: 'project', value: this.projectInput},
      {label: 'budget id', value: this.idInput},
      {label: 'status', value: this.statusInput},
      {label: 'change status', value: 'no-sort-filter'},
      {label: 'view PDF', value: 'no-sort-filter'},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.data = this.getBudgetsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  getBudgetsData(): {type: TableDataType, content: any}[][] {
    // FIXME: get actual data
    return [
      [
        {type: TableDataType.AVATAR_2LINES,
          content: {
            src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
            name: 'John Doe',
            text: 'My Company'
          }
        },
        {type: TableDataType.TEXT, content: 'My project'},
        {type: TableDataType.TEXT, content: '123456'},
        {type: TableDataType.PILL, content: {text: 'In Progress', color: 'blue'}},
        {type: TableDataType.BUTTON, content: {text: 'Mark for payment', icon: 'credit-card-outline', url: '', color: 'cool-gray'}},
        {type: TableDataType.BUTTON, content: {text: 'PDF', icon: 'file-text-outline', url: '', color: 'cool-gray'}},
        {type: TableDataType.ACTIONS, content: ['view', 'edit', 'delete']}
      ]
    ];
  }

}
