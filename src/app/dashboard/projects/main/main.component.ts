import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../../_services/cache.service";
import {Project, Status} from "../../../_domain/project";
import {FirebaseService} from "../../../_services/firebase.service";
import {AlertService} from "../../../_services/alert.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-projects',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];
  loading: boolean;

  inputs: {id: string, name: string, client: string, rate: number, status: Status} = {
    id: null,
    name: null,
    client: null,
    rate: null,
    status: null
  };

  isModalOpen: boolean;
  projectToDelete: Project;
  deleting: boolean;

  clients:  {value: string, text: string}[];
  clientID: string;

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private firebaseService: FirebaseService,
    private cacheService: CacheService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headers = [
      {label: 'client', value: this.inputs.client},
      {label: 'project name', value: this.inputs.name},
      {label: 'project id', value: this.inputs.id},
      {label: 'hourly rate', value: this.inputs.rate},
      {label: 'status', value: this.inputs.status},
      {label: 'change status', value: 'no-sort-filter'},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.getProjectsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async getProjectsData(): Promise<void> {
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    await this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      projects.forEach(project => {
        project.client.firebaseService = this.firebaseService;

        table.push([
          {type: TableDataType.AVATAR, content: { src: project.client.getAvatar(), name: project.client.name, text: project.client.company }},
          {type: TableDataType.TEXT, content: project.name},
          {type: TableDataType.TEXT, content: project.id},
          {type: TableDataType.MONEY, content: project.rate},
          {type: TableDataType.PILL, content: project.getStatusInfo()},
          {type: TableDataType.BUTTON, content: {
              text: project.getNextStatusActionInfo().text,
              icon: project.getNextStatusActionInfo().icon,
              color: 'cool-gray'
            }
          },
          {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
        ]);
      });

      // Get clients for select
      this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
        this.clients = clients.map(client => ({value: client.id, text: client.name}));
        this.clients.unshift({value: 'all', text: 'All clients'});

        if (this.clients.length > 0)
          this.clientID = this.clients[0].value;
      }));

      this.loading = false;
    }));

    this.data = table;
  }

  doAction(action: string, index: number): void {
    const projectID = this.data[index][2].content;
    const projectName = this.data[index][1].content;
    const clientName = this.data[index][0].content.name;

    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      let project: Project;
      projects.forEach(p => {
        if (p.id === projectID && p.name === projectName && p.client.name === clientName)
          project = p;
      })

      if (project && action === 'edit') this.editProject(project);
      else if (project && action === 'delete') {
        this.isModalOpen = true;
        this.projectToDelete = project;
      } else if (project && action === 'change-status') this.changeStatus(project, index);
    }));
  }

  editProject(project: Project): void {
    this.router.navigate(['dashboard/projects/edit/', project.key]).then(r => r);
  }

  async deleteProject(project: Project): Promise<void> {
    this.deleting = true;
    const firebaseService = this.firebaseService;

    // Delete budgets
    await this.cacheService.getUserBudgets().then(obs => obs.subscribe(async budgets => {
      for (const budget of budgets) {
        if (budget.project.id === project.id)
          await firebaseService.deleteBudgetByKey(budget.key)
            .catch((error) => {
              this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
            });
      }
    }));
    this.cacheService.userBudgets = null;

    // Delete project
    firebaseService.deleteProjectByKey(project.key).then(() => {
      this.cacheService.userProjects = null;
      this.alertService.showAlert('Project deleted', 'Project ' + project.name + ' deleted successfully', 'success');
      this.getProjectsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');

    }).finally(() => {
      this.deleting = false;
      this.isModalOpen = false;
    });
  }

  changeStatus(project: Project, index: number): void {
    project.status = Status.COMPLETED;
    this.firebaseService.setProject(project).then(() => {
      this.cacheService.userProjects = null;
      this.data[index][4] = {type: TableDataType.PILL, content: project.getStatusInfo()};
      this.data[index][5] = {type: TableDataType.BUTTON, content: {
          text: project.getNextStatusActionInfo().text,
          icon: project.getNextStatusActionInfo().icon,
          color: 'cool-gray'
        }
      };
    });
  }

  filterByClient(): void {
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      projects.forEach(project => {
        project.client.firebaseService = this.firebaseService;

        if (this.clientID === 'all' || project.client.id === this.clientID) {
          table.push([
            {type: TableDataType.AVATAR, content: { src: project.client.getAvatar(), name: project.client.name, text: project.client.company }},
            {type: TableDataType.TEXT, content: project.name},
            {type: TableDataType.TEXT, content: project.id},
            {type: TableDataType.MONEY, content: project.rate},
            {type: TableDataType.PILL, content: project.getStatusInfo()},
            {type: TableDataType.BUTTON, content: {
                text: project.getNextStatusActionInfo().text,
                icon: project.getNextStatusActionInfo().icon,
                color: 'cool-gray'
              }
            },
            {type: TableDataType.ACTIONS, content: ['edit', 'delete']}
          ]);
        }
      });

      this.data = table;
      this.loading = false;
    }));
  }

}
