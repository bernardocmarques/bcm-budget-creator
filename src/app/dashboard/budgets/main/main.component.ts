import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';

import * as eva from 'eva-icons';
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {CacheService} from "../../../_services/cache.service";
import {Budget, Status} from "../../../_domain/budget";
import {AlertService} from "../../../_services/alert.service";
import {Router} from "@angular/router";
import {FirebaseService} from "../../../_services/firebase.service";
import {NgForm} from "@angular/forms";
import {printMoney} from "../../../_util/number";


@Component({
  selector: 'app-budgets',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  headers: {label: string, value: any}[];
  data: {type: TableDataType, content: any}[][];
  loading: boolean;

  inputs: {id: string, client: string, project: string, price: number, status: Status, creationTimestamp: number} = {
    id: null,
    client: null,
    project: null,
    price: null,
    status: null,
    creationTimestamp: null
  };

  isModalOpen: boolean;
  budgetToDelete: Budget;
  deleting: boolean;

  clients:  {value: string, text: string}[];
  clientID: string;

  projects:  {value: string, text: string}[];
  projectID: string;

  isPayModalOpen: boolean;
  budgetToPay: Budget;
  amountToPay: number;
  paying: boolean;

  @ViewChild('f', { static: false }) f: NgForm;

  tableOptions = {
    order: [[ 4, 'desc' ]], // default order
    columnDefs: [
      { orderData: 3,   targets: 4 }, // date order by timestamp
      { type: 'natural', targets: [0, 1, 2, 3, 4, 5, 6] },
      { orderable: false, targets: [7, 8, 9] }, // not order last rows (actions)
    ]
  }

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
      {label: 'date TS (sorting)', value: 'no-sort-filter'},
      {label: 'date', value: this.inputs.creationTimestamp},
      {label: 'price', value: this.inputs.price},
      {label: 'status', value: this.inputs.status},
      {label: 'change status', value: 'no-sort-filter'},
      {label: 'view PDF', value: 'no-sort-filter'},
      {label: 'actions', value: 'no-sort-filter'}
    ];
    this.getBudgetsData();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async getBudgetsData(): Promise<void> {
    this.loading = true;
    let table: { type: TableDataType, content: any }[][] = [];

    await this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      budgets.forEach(budget => {
        budget.client.firebaseService = this.injector.get(FirebaseService);
        budget.project.client.firebaseService = this.injector.get(FirebaseService);

        table.push([
          {
            type: TableDataType.AVATAR,
            content: {src: budget.client.getAvatar(), name: budget.client.name, text: budget.client.company}
          },
          {type: TableDataType.TEXT, content: budget.project.name},
          {type: TableDataType.TEXT, content: budget.id},
          {type: TableDataType.TEXT, content: budget.creationTimestamp},
          {type: TableDataType.DATE, content: budget.creationTimestamp},
          {
            type: TableDataType.MONEY,
            content: budget.getTotalPrice()
          },
          {type: TableDataType.PILL, content: budget.getStatusInfo()},
          {
            type: TableDataType.BUTTON, content: {
              text: budget.getNextStatusActionInfo().text,
              icon: budget.getNextStatusActionInfo().icon,
              color: 'cool-gray'
            }
          },
          {
            type: TableDataType.BUTTON,
            content: {text: budget.pdfLink ? 'PDF' : null, icon: 'file-text-outline', color: 'cool-gray'}
          },
          {type: TableDataType.ACTIONS, content: ['view', 'edit', 'delete']}
        ]);
      });

      // Get clients for select
      this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
        this.clients = clients.map(client => ({value: client.id, text: client.name}));
        this.clients.unshift({value: 'all', text: 'All clients'});

        if (this.clients.length > 0)
          this.clientID = this.clients[0].value;
      }));

      // Get projects for select
      this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
        this.projects = projects.map(project => ({value: project.id, text: project.name}));
        this.projects.unshift({value: 'all', text: 'All projects'});

        if (this.projects.length > 0)
          this.projectID = this.projects[0].value;
      }));

      this.loading = false;
    }));

    this.data = table;
  }

  doAction(action: string, index: number, col?: number): void {
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
      } else if (budget && action === 'btn-clicked') {
        if (col === 8) this.openPDF(budget.pdfLink);
        else if (col === 7 && budget.status !== Status.FOR_PAYMENT) this.changeStatus(budget, index);
        else if (col === 7 && budget.status === Status.FOR_PAYMENT) {
          this.isPayModalOpen = true;
          this.budgetToPay = budget;
        }
      }
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
      this.getBudgetsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error deleting document: ' + error, 'danger');
    }).finally(() => {
      this.deleting = false;
      this.isModalOpen = false;
    });
  }

  payBudget(budget: Budget, payFull = false): void {
    if (payFull)
      this.amountToPay = budget.getTotalPrice() - budget.totalPaid;

    if (!this.amountToPay) {
      this.alertService.showAlert('No amount entered', 'Please enter an amount to pay.', 'danger');
      return;
    }

    if (this.amountToPay <= 0) {
      this.alertService.showAlert('Invalid amount', 'Please enter an amount that\'s bigger than 0.', 'danger');
      return;
    }

    if (this.amountToPay > (budget.getTotalPrice() - budget.totalPaid)) {
      this.alertService.showAlert('Invalid amount', 'Please enter an amount that\'s smaller or equal to ' + printMoney(budget.getTotalPrice() - budget.totalPaid), 'danger');
      return;
    }

    this.paying = true;
    this.budgetToPay.totalPaid += this.amountToPay;
    this.injector.get(FirebaseService).setBudget(this.budgetToPay).then(() => {
      this.cacheService.userBudgets = null;
      if (this.budgetToPay.getTotalPrice() === this.budgetToPay.totalPaid) {
        this.changeStatus(this.budgetToPay);
        this.alertService.showAlert('Budget fully paid', 'Budget ' + budget.id + ' is fully paid', 'success');
      } else this.alertService.showAlert('Paid ' + printMoney(this.amountToPay), 'Added payment of ' + printMoney(this.amountToPay) + ' to budget ' + budget.id, 'success');
      this.getBudgetsData();

    }).catch((error) => {
      this.alertService.showAlert('Error', 'Error updating document: ' + error, 'danger');
    }).finally(() => {
      this.paying = false;
      this.isPayModalOpen = false;
      this.amountToPay = null;
    });
  }

  changeStatus(budget: Budget, index?: number): void {
    if (budget.status === Status.IN_PROGRESS) {
      budget.status = Status.FOR_PAYMENT;
      budget.completeTimestamp = new Date().getTime();

    } else if (budget.status === Status.FOR_PAYMENT) {
      budget.status = Status.PAID;
      budget.paidTimestamp = new Date().getTime();
    }

    this.injector.get(FirebaseService).setBudget(budget).then(() => {
      this.cacheService.userBudgets = null;
      if (index) {
        this.data[index][6] = {type: TableDataType.PILL, content: budget.getStatusInfo()};
        this.data[index][7] = {type: TableDataType.BUTTON, content: {
            text: budget.getNextStatusActionInfo().text,
            icon: budget.getNextStatusActionInfo().icon,
            color: 'cool-gray'
          }
        };
      }
    });
  }

  openPDF(url: string): void {
    window.open(url, "_blank");
  }

  async filterByClient(): Promise<void> {
    this.projects = [];

    await this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      projects.forEach(project => {
        if (project.client.id === this.clientID)
          this.projects.push({value: project.id, text: project.name})
      });
      this.projects.unshift({value: 'all', text: 'All projects'});

      if (this.projects.length > 0)
        this.projectID = this.projects[0].value;
    }));

    this.filterByClientAndProject();
  }

  filterByClientAndProject(): void {
    this.loading = true;
    let table: {type: TableDataType, content: any}[][] = [];

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      budgets.forEach(budget => {
        budget.client.firebaseService = this.injector.get(FirebaseService);
        budget.project.client.firebaseService = this.injector.get(FirebaseService);

        if ((this.clientID === 'all' || budget.client.id === this.clientID) && (this.projectID === 'all' || budget.project.id === this.projectID)) {
          table.push([
            {
              type: TableDataType.AVATAR,
              content: {src: budget.client.getAvatar(), name: budget.client.name, text: budget.client.company}
            },
            {type: TableDataType.TEXT, content: budget.project.name},
            {type: TableDataType.TEXT, content: budget.id},
            {type: TableDataType.MONEY, content: budget.items.map(item => item.price).reduce((total, value) => total + value)},
            {type: TableDataType.PILL, content: budget.getStatusInfo()},
            {
              type: TableDataType.BUTTON, content: {
                text: budget.getNextStatusActionInfo().text,
                icon: budget.getNextStatusActionInfo().icon,
                color: 'cool-gray'
              }
            },
            {
              type: TableDataType.BUTTON,
              content: {text: budget.pdfLink ? 'PDF' : null, icon: 'file-text-outline', color: 'cool-gray'}
            },
            {type: TableDataType.ACTIONS, content: ['view', 'edit', 'delete']}
          ]);
        }
      });

      this.data = table;
      this.loading = false;
    }));
  }

}
