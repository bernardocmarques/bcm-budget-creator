import {AfterViewInit, Component, Injector, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../../_services/cache.service";
import {Project, Status} from "../../../_domain/project";
import {FirebaseService} from "../../../_services/firebase.service";
import {AlertService} from "../../../_services/alert.service";
import {Router} from "@angular/router";


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

  constructor(
    private cacheService: CacheService,
    private alertService: AlertService,
    private router: Router,
    private injector: Injector
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
    this.data = this.getProjectsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  getProjectsData(): {type: TableDataType, content: any}[][] {
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      projects.forEach(project => {
        project.client.firebaseService = this.injector.get(FirebaseService);

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
      this.loading = false;
    }));

    return table;
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

  deleteProject(project: Project): void {
    this.deleting = true;
    this.injector.get(FirebaseService).deleteProjectByKey(project.key).then(() => {
      this.cacheService.userProjects = null;
      this.alertService.showAlert('Project deleted', 'Project ' + project.name + ' deleted successfully', 'success');
      this.data = this.getProjectsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
    }).finally(() => {
      this.deleting = false;
      this.isModalOpen = false;
    });
  }

  changeStatus(project: Project, index: number): void {
    project.status = Status.COMPLETED;
    this.injector.get(FirebaseService).setProject(project).then(() => {
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

}
