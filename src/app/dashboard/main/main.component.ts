import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../_components/tables/table-data/table-data.component";
import {numberWithCommas} from "../../_util/number";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  moneySVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z\" clip-rule=\"evenodd\" /></svg>";
  completedSVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" /></svg>";
  peopleSVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z\" /></svg>";

  clientInput: string;
  projectInput: string;
  amountInput: number;
  statusSelect: string;
  dateInput: string;

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];

  constructor() { }

  ngOnInit(): void {
    this.data = this.getRecentActivity();
    this.headers = [
      {label: 'client', value: this.clientInput},
      {label: 'project', value: this.projectInput},
      {label: 'amount', value: this.amountInput},
      {label: 'status', value: this.statusSelect},
      {label: 'date', value: this.dateInput}
    ];
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  getRecentActivity(): {type: TableDataType, content: any}[][] {
    // FIXME: get actual data
    return [
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'Wenzel Dashington', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'Wenzel Dashington', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
      [
        {type: TableDataType.AVATAR_2LINES, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe', text: 'Google Inc.'}},
        {type: TableDataType.TEXT, content: 'Website update'},
        {type: TableDataType.MONEY, content: 863.45},
        {type: TableDataType.PILL, content: {text: 'Approved', color: 'green'}},
        {type: TableDataType.DATE, content: new Date()}
      ],
    ];
  }

  formatNumber(value: number): string {
    return numberWithCommas(value);
  }

}