import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../_services/cache.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];
  loading: boolean;

  idInput: number;
  nameInput: string;
  clientInput: string;
  rateInput: number;

  constructor(private cacheService: CacheService) { }

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
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      projects.forEach(async project => {
        const client = await this.cacheService.getClientByKey(project.clientKey);
        table.push([
          {type: TableDataType.AVATAR_2LINES, content: {
            src: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
              name: client.name,
              company: client.company
            }
          },
          {type: TableDataType.TEXT, content: project.name},
          {type: TableDataType.TEXT, content: project.id},
          {type: TableDataType.MONEY, content: project.rate},
          {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
        ]);
      });
      this.loading = false;
    }));

    return table;
  }

}
