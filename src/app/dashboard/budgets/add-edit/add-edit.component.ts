import {Component, OnInit, ViewChild} from '@angular/core';
import * as eva from 'eva-icons';
import {Budget, BudgetItem, getStatusString, Status} from "../../../_domain/budget";
import {NgForm} from "@angular/forms";
import {FirebaseService} from "../../../_services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {numberWithCommas} from "../../../_util/number";
import {hoursToString} from "../../../_util/time";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {

  budget: Budget;
  loading: boolean;

  clients:  {value: string, text: string}[];
  clientID: string;

  projects:  {value: string, text: string}[];
  projectID: string;

  original = {
    clientID: null,
    projectID: null,
    budgetID: null
  }

  status: {value: Status, text: string}[] = Object.keys(Status)
    .filter(key => !isNaN(Number(Status[key])))
    .map(key => { return {value: Status[key], text: getStatusString(Status[key])} });

  headers: {label: string, value: any}[];
  footers: string[];
  data: {type: TableDataType, content: any}[][];
  items: BudgetItem[];

  totalHours: number = 0;
  totalPrice: number = 0;
  nextItemID: number = 0;

  mode: "edit" | "add";
  processing: boolean;
  submitted: boolean;

  noRateAlertShown = false;

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private cacheService: CacheService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.headers = [
      {label: 'quantity', value: 'no-sort-filter'}, // TODO: refactor, remove value
      {label: 'description', value: 'no-sort-filter'},
      {label: 'hours', value: 'no-sort-filter'},
      {label: 'price', value: 'no-sort-filter'},
      {label: 'actions', value: 'no-sort-filter'}
    ];

    this.data = [];
    this.items = [];

    await this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      this.clients = clients.map(client => ({value: client.id, text: client.name}));
    }));

    if (this.router.url.includes('edit')) {
      this.mode = "edit";
      this.route.params.subscribe(params => {
        this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
          for (const budget of budgets) {
            if (budget.key === params.id) {
              this.budget = new Budget(budget, budget.key);
              setTimeout(() => this.budget.items.forEach(item => this.addItem(item)), 0);
              this.clientID = budget.client.id;
              this.projectID = budget.project.id;
              this.original.clientID = this.clientID;
              this.original.projectID = this.projectID;
              this.original.budgetID = this.budget.id;
              break;
            }
          }

          this.initProjects();
          this.loading = false;

          setTimeout(() => eva.replace(), 0);
        }));
      }).unsubscribe();

    } else if (this.router.url.includes('add')) {
      this.mode = "add";
      this.budget = new Budget({});
      this.loading = false;
      setTimeout(() => eva.replace(), 0);
    }
  }

  initProjects(): void {
    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      this.projects = projects
        .filter(project => project.client.id === this.clientID)
        .map(project => ({value: project.id, text: project.name}));

      if (this.mode === 'add' && this.projects?.length > 0)
        this.projectID = this.projects[0].value;

      else if (this.mode === 'add' && !this.submitted) this.alertService.showAlert('No projects available', 'This client has no projects yet. Please create a project first.', 'warning');

      this.initID();
    }));
  }

  initID(): void {
    if (this.mode === 'edit') {
      if (this.clientID === this.original.clientID && this.projectID === this.original.projectID) {
        this.budget.id = this.original.budgetID;
        return;
      }
    }

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      let maxID: number = 0;
      for (let budget of budgets) {
        if (budget.client.id !== this.clientID || budget.project.id !== this.projectID) continue;
        if (budget.id.length < 7) continue;
        const id = parseInt(budget.id.replace(/\D/g,'').substr(budget.id.length - 3));
        if (id > maxID) maxID = id;
      }

      let nextID: number | string = maxID + 1;
      while (!this.isUniqueID(budgets, this.clientID, this.projectID, nextID.toString())) nextID++;

      nextID = nextID.toString().padStart(3, '0');
      this.budget.id = this.clientID.replace(/\D/g,'') + this.projectID.replace(/\D/g,'') + nextID;
    }));
  }

  addItem(item?: BudgetItem): void {
    const index = this.data.length;

    this.items.push({
      id: this.nextItemID,
      quantity: item ? item.quantity : 1,
      description: item ? item.description : null,
      hours: item ? item.hours : null,
      price: item ? item.price : null
    });

    this.data.push([
      {type: TableDataType.INPUT_NUMBER, content: {
          size: 6,
          id: 'quantity-item-' + this.nextItemID,
          form: this.f,
          value: this.items[index].quantity,
          placeholder: 'Quantity',
          required: true,
          minValue: 1,
          requiredErrorMessage: 'A quantity is required',
          minValueErrorMessage: 'Quantity must be equal or bigger than 1'
        }
      },
      {type: TableDataType.INPUT_TEXT, content: {
          id: 'description-item-' + this.nextItemID,
          form: this.f,
          value: this.items[index].description,
          placeholder: 'Brief item description',
          required: true,
          requiredErrorMessage: 'A description is required',
        }
      },
      {type: TableDataType.INPUT_NUMBER, content: {
          size: 8,
          id: 'hours-item-' + this.nextItemID,
          form: this.f,
          value: this.items[index].hours,
          placeholder: 'Hours',
          required: true,
          minValue: 0,
          requiredErrorMessage: 'Hours are required',
          minValueErrorMessage: 'Hours must be equal or bigger than 0'
        }
      },
      {type: TableDataType.INPUT_NUMBER, content: {
          size: 8,
          id: 'price-item-' + this.nextItemID,
          form: this.f,
          value: this.items[index].price,
          placeholder: 'Price',
          required: true,
          minValue: 0,
          requiredErrorMessage: 'A price is required',
          minValueErrorMessage: 'Price must be equal or bigger than 0'
        }
      },
      {type: TableDataType.ACTIONS, content: ['delete']}
    ]);

    this.nextItemID++;
    this.updateValues(index);
  }

  async updateValues(index: number, col?: number): Promise<void> {
    if (this.data.length <= 0) return;

    let colChanged: 'hours' | 'price';
    if (col === 2) colChanged = "hours";
    else if (col === 3) colChanged = "price";

    let rate;
    await this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      for (const project of projects) {
        if (project.client.id === this.clientID && project.id === this.projectID) {
          rate = project.rate;
          break;
        }
      }
    }));

    // Update hours & price
    if (!rate && !this.noRateAlertShown) {
      this.alertService.showAlert('No rate set', 'This project has no rate set yet. Unless you set a rate, hours and price won\'t be automatically calculated.', 'warning');
      this.noRateAlertShown = true;

    } else if (rate) {
      const item = this.items[index];
      const id = item.id;

      if (colChanged === 'hours') { // changed hours value
        let price;
        if (item.hours === null && item.price !== null) price = null;
        else if (item.hours !== null && !this.isCorrectPrice(item.hours, item.price, rate))
          price = this.calculatePrice(item.hours, rate);

        if (price !== undefined) {
          item.price = price;
          this.f.controls['price-item-' + id].setValue(price);
        }

      } else if (colChanged === 'price') { // changed price value
        let hours;
        if (item.price === null && item.hours !== null) hours = null;
        else if (item.price !== null && !this.isCorrectHours(item.hours, item.price, rate))
          hours = this.calculateHours(item.price, rate);

        if (hours !== undefined) {
          item.hours = hours;
          this.f.controls['hours-item-' + id].setValue(hours);
        }
      }
    }

    this.updateTotals();
  }

  updateTotals(): void {
    this.totalHours = 0;
    this.totalPrice = 0;

    this.items.forEach(item => {
      this.totalHours += item.hours ? item.quantity * item.hours : 0;
      this.totalPrice += item.price ? item.quantity * item.price : 0;
    });

    this.footers = [
      'Total',
      '',
      hoursToString(this.totalHours),
      numberWithCommas(this.totalPrice) + ' €',
      ''
    ];
  }

  calculatePrice(hours: number, rate: number): number {
    return rate * hours;
  }

  calculateHours(price: number, rate: number): number {
    return price / rate;
  }

  isCorrectPrice(hours: number, price: number, rate: number) {
    return price === this.calculatePrice(hours, rate);
  }

  isCorrectHours(hours: number, price: number, rate: number) {
    return hours === this.calculateHours(price, rate);
  }

  setItem(row: number, col: number, value: any): void {
    const item = this.items[row];

    if (col === 0) item.quantity = value;
    else if (col === 1) item.description = value;
    else if (col === 2) {
      this.totalHours += value - item.hours;
      item.hours = value;
    }
    else if (col === 3) {
      this.totalPrice += value - item.price;
      item.price = value;
    }
    this.updateValues(row, col);
  }

  doAction(action: string, index: number): void {
    if (action === 'delete') {
      const item = this.items[index];
      const id = item.id;

      // Delete data
      this.items.splice(index, 1);
      this.data.splice(index, 1);

      // Delete form controls
      this.f.form.removeControl('quantity-item-' + id);
      this.f.form.removeControl('description-item-' + id);
      this.f.form.removeControl('hours-item-' + id);
      this.f.form.removeControl('price-item-' + id);

      // Remove from total
      this.totalHours -= item.hours;
      this.totalPrice -= item.price;
      this.updateTotals();
    }
  }

  async onSubmit() {
    // Check if ID is unique
    let isUniqueID = true;
    if (this.mode === "add") {
      await this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
        if (!this.isUniqueID(budgets, this.clientID, this.projectID, this.budget.id)) {
          this.f.form.controls['id'].setErrors({'incorrect': true});
          isUniqueID = false;
          return;
        }
      }));
    }

    // Check if there are items
    if (this.items.length === 0) {
      this.alertService.showAlert("Error", "Invalid form. Please add items to your budget.", 'danger');
      return;
    }

    if (this.f.form.valid && isUniqueID && this.items.length > 0) {
      this.processing = true;
      const budgetToUpdate = new Budget(this.budget, this.budget.key);

      await this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
        clients.forEach(client => {
          if (client.id === this.clientID)
            budgetToUpdate.client = client;
        });
      }));

      await this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
        projects.forEach(project => {
          if (project.client.id === this.clientID && project.id === this.projectID)
            budgetToUpdate.project = project;
        });
      }));

      budgetToUpdate.status = !this.budget.status ? Status.IN_PROGRESS : parseInt(this.budget.status as unknown as string);
      budgetToUpdate.items = this.items;

      if (this.mode == "add") {
        this.firebaseService.addBudget(budgetToUpdate).then(() => {
          this.cacheService.userBudgets = null;
          this.alertService.showAlert('New budget created!', 'New budget successfully created.', 'success');

        }).catch((error) => {
          this.alertService.showAlert('Error', 'Error writing document: ' + error, 'danger');

        }).finally(() => {
          this.processing = false;
          this.submitted = true;
          this.goBack();
        });

      } else if (this.mode == "edit") {
        this.firebaseService.setBudget(budgetToUpdate).then(() => {
          this.cacheService.userBudgets = null;
          this.alertService.showAlert('Changes saved!', 'Budget #' + this.budget.id + ' successfully edited.', 'success');

        }).catch((error) => {
          this.alertService.showAlert('Error', 'Error writing document: ' + error, 'danger');

        }).finally(() => {
          this.processing = false;
          this.submitted = true;
          this.goBack();
        });

      } else {
        console.error("Invalid mode!");
        this.goBack();
      }

    } else {
      this.alertService.showAlert("Error", "Invalid form. Please fix the errors and submit again.", 'danger');
    }
  }

  isUniqueID(budgets: Budget[], clientID: string, projectID: string, id: string): boolean {
    const IDs: string[] = [];
    const full_id = clientID.replace(/\D/g,'') + projectID.replace(/\D/g,'') + id.padStart(3, "0");

    for (let budget of budgets) {
      if (budget.client.id === clientID && budget.project.id === projectID)
        IDs.push(budget.id.replace(/\D/g,''));
    }
    return !IDs.includes(full_id);
  }

  goBack() {
    this.router.navigate(['dashboard/budgets']).then(r => r);
  }

}
