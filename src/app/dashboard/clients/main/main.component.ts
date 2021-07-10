import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../../_services/cache.service";
import {FirebaseService} from "../../../_services/firebase.service";
import { Client } from 'src/app/_domain/client';
import {AlertService} from "../../../_services/alert.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-clients',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];
  loading: boolean;

  inputs: {id: string, name: string, company: string} = {
    id: null,
    name: null,
    company: null
  };

  isModalOpen: boolean;
  clientToDelete: Client;
  deleting: boolean;

  constructor(
    private cacheService: CacheService,
    private alertService: AlertService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.headers = [
      {label: 'client', value: this.inputs.name},
      {label: 'client id', value: this.inputs.id},
      {label: 'company', value: this.inputs.company},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.getClientsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async getClientsData(): Promise<void> {
    this.loading = true;
    let table: { type: TableDataType, content: any }[][] = [];

    await this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      clients.forEach(client => {
        client.firebaseService = this.firebaseService;

        table.push([
          {type: TableDataType.AVATAR, content: {src: client.getAvatar(), name: client.name}},
          {type: TableDataType.TEXT, content: client.id},
          {type: TableDataType.TEXT, content: client.company},
          {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
        ]);
      });
      this.loading = false;
    }));

    this.data = table;
  }

  doAction(action: string, index: number): void {
    const clientID = this.data[index][1].content;
    this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      let client: Client;
      clients.forEach(c => {
        if (c.id === clientID)
          client = c;
      })

      if (client && action === 'edit') this.editClient(client);
      else if (client && action === 'delete') {
        this.isModalOpen = true;
        this.clientToDelete = client;
      }
    }));
  }

  editClient(client: Client): void {
    this.router.navigate(['dashboard/clients/edit/', client.key]).then(r => r);
  }

  async deleteClient(client: Client): Promise<void> {
    this.deleting = true;

    // Delete budgets
    await this.cacheService.getUserBudgets().then(obs => obs.subscribe(async budgets => {
      for (const budget of budgets) {
        if (budget.client.id === client.id)
          await this.firebaseService.deleteBudgetByKey(budget.key)
            .catch((error) => {
              this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
            });
      }
    }));
    this.cacheService.userBudgets = null;

    // Delete projects
    await this.cacheService.getUserProjects().then(obs => obs.subscribe(async projects => {
      for (const project of projects) {
        if (project.client.id === client.id)
          await this.firebaseService.deleteProjectByKey(project.key)
            .catch((error) => {
              this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
            });
      }
    }));
    this.cacheService.userProjects = null;

    // Delete client
    this.firebaseService.deleteClientByKey(client.key).then(() => {
      this.cacheService.userClients = null;
      this.alertService.showAlert('Client deleted', 'Client ' + client.name + ' deleted successfully', 'success');
      this.getClientsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');

    }).finally(() => {
      this.deleting = false;
      this.isModalOpen = false;
    });
  }

}
