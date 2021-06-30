import {AfterViewInit, Component, Injector, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../../_services/cache.service";
import {Budget, Status} from "../../../_domain/budget";
import {AlertService} from "../../../_services/alert.service";
import {Router} from "@angular/router";
import {FirebaseService} from "../../../_services/firebase.service";


@Component({
  selector: 'app-budgets',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];
  loading: boolean;

  inputs: {id: string, client: string, project: string, status: Status} = {
    id: null,
    client: null,
    project: null,
    status: null
  };

  isModalOpen: boolean;
  budgetToDelete: Budget;
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
      {label: 'project', value: this.inputs.project},
      {label: 'budget id', value: this.inputs.id},
      {label: 'status', value: this.inputs.status},
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
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      budgets.forEach(budget => {
        budget.client.firebaseService = this.injector.get(FirebaseService);
        budget.project.client.firebaseService = this.injector.get(FirebaseService);

        table.push([
          {type: TableDataType.AVATAR, content: { src: budget.client.getAvatar(), name: budget.client.name, text: budget.client.company}},
          {type: TableDataType.TEXT, content: budget.project.name},
          {type: TableDataType.TEXT, content: budget.id},
          {type: TableDataType.PILL, content: budget.getStatusInfo()},
          {type: TableDataType.BUTTON, content: {
            text: budget.getNextStatusActionInfo().text,
            icon: budget.getNextStatusActionInfo().icon,
            color: 'cool-gray'
            }
          },
          {type: TableDataType.BUTTON, content: {text: 'PDF', icon: 'file-text-outline', color: 'cool-gray'}},
          {type: TableDataType.ACTIONS, content: ['view', 'edit', 'delete']}
        ]);
      });
      this.loading = false;
    }));

    return table;
  }

  doAction(action: string, index: number): void {
    const budgetID = this.data[index][2].content;
    const projectName = this.data[index][1].content;
    const clientName = this.data[index][0].content.name;

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      let budget: Budget;
      budgets.forEach(b => {
        if (b.id === budgetID && b.project.name === projectName && b.client.name === clientName)
          budget = b;
      })

      if (budget && action === 'view') this.viewBudget(budget);
      else if (budget && action === 'edit') this.editBudget(budget);
      else if (budget && action === 'delete') {
        this.isModalOpen = true;
        this.budgetToDelete = budget;
      } else if (budget && action === 'change-status') this.changeStatus(budget, index);
    }));
  }

  viewBudget(budget: Budget): void {
    this.router.navigate(['dashboard/budgets/view/', budget.key]).then(r => r);
  }

  editBudget(budget: Budget): void {
    this.router.navigate(['dashboard/budgets/edit/', budget.key]).then(r => r);
  }

  deleteBudget(budget: Budget): void {
    this.deleting = true;
    this.injector.get(FirebaseService).deleteBudgetByKey(budget.key).then(() => {
      this.cacheService.userBudgets = null;
      this.alertService.showAlert('Budget deleted', 'Budget ' + budget.id + ' deleted successfully', 'success');
      this.data = this.getBudgetsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
    }).finally(() => {
      this.deleting = false;
      this.isModalOpen = false;
    });
  }

  changeStatus(budget: Budget, index: number): void {
    // project.status = Status.COMPLETED;
    // this.injector.get(FirebaseService).setProject(project).then(() => {
    //   this.cacheService.userProjects = null;
    //   this.data[index][4] = {type: TableDataType.PILL, content: project.getStatusInfo()};
    //   this.data[index][5] = {type: TableDataType.BUTTON, content: {
    //       text: project.getNextStatusActionInfo().text,
    //       icon: project.getNextStatusActionInfo().icon,
    //       color: 'cool-gray'
    //     }
    //   };
    // });
  }

}
