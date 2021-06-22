import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../_components/tables/table-data/table-data.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: [
  ]
})
export class ProjectsComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];

  idInput: number;
  nameInput: string;
  clientInput: string;
  rateInput: number;

  constructor() { }

  ngOnInit(): void {
    this.headers = [
      {label: 'client', value: this.clientInput},
      {label: 'project name', value: this.nameInput},
      {label: 'project id', value: this.idInput},
      {label: 'hourly rate', value: this.rateInput},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.data = this.getProjectsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  getProjectsData(): {type: TableDataType, content: any}[][] {
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
        {type: TableDataType.TEXT, content: 'My project name'},
        {type: TableDataType.TEXT, content: '123456'},
        {type: TableDataType.MONEY, content: '15'},
        {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
      ],
    ];
  }

}