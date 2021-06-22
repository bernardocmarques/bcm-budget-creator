import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../_components/tables/table-data/table-data.component";
import {FirebaseService} from "../../_services/firebase.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];

  idInput: number;
  clientInput: string;
  companyInput: string;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.headers = [
      {label: 'client', value: this.clientInput},
      {label: 'client id', value: this.idInput},
      {label: 'company', value: this.companyInput},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.data = this.getClientsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  getClientsData(): {type: TableDataType, content: any}[][] {
    // console.log(this.firebaseService.uid)
    // this.firebaseService.getAllClients().then(clients => {
    //   console.log(clients)
    // });

    // FIXME: get actual data
    return [
      [
        {type: TableDataType.AVATAR_1LINE, content: {src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ', name: 'John Doe'}},
        {type: TableDataType.TEXT, content: '123456'},
        {type: TableDataType.TEXT, content: 'My company'},
        {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
      ]
    ];
  }

}
