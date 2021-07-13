import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as eva from 'eva-icons';
import {Budget, BudgetItem, getStatusString, Status} from "../../../_domain/budget";
import {NgForm} from "@angular/forms";
import {FirebaseService} from "../../../_services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {digitCount, numberWithCommas} from "../../../_util/number";
import {hoursToString} from "../../../_util/time";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit, AfterViewInit {

  budget: Budget;
  loading: boolean;

  clients:  {value: string, text: string}[];
  clientID: string;

  projects:  {value: string, text: string}[];
  projectID: string;

  status: {value: Status, text: string}[] = [
    {value: Status.IN_PROGRESS, text: getStatusString(Status.IN_PROGRESS)},
    {value: Status.FOR_PAYMENT, text: getStatusString(Status.FOR_PAYMENT)},
    {value: Status.PAID, text: getStatusString(Status.PAID)},
  ];

  headers: {label: string, value: any}[];
  footers: string[];
  data: {type: TableDataType, content: any}[][];
  items: BudgetItem[];
  totalHours: number = 0;
  totalPrice: number = 0;

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
      {label: 'quantity', value: 'no-sort-filter'},
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
              this.budget.items.forEach(item => this.addItem(item));
              this.clientID = budget.client.id;
              this.projectID = budget.project.id;
              break;
            }
          }

          this.initProjects();
          this.loading = false;
        }));
      }).unsubscribe();

    } else if (this.router.url.includes('add')) {
      this.mode = "add";
      this.budget = new Budget({});
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  initProjects(): void {
    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      this.projects = projects
        .filter(project => project.client.id === this.clientID)
        .map(project => ({value: project.id, text: project.name}));

      if (this.projects && this.projects.length > 0)
        this.projectID = this.projects[0].value;

      else if (!this.submitted) this.alertService.showAlert('No projects available', 'This client has no projects yet. Please create a project first.', 'warning');

      this.initID();
    }));
  }

  initID(): void {
    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      let maxID: number = 0;
      for (let budget of budgets) {
        if (budget.client.id !== this.clientID || budget.project.id !== this.projectID) continue;
        const id = parseInt(budget.id.replace(/\D/g,'').substr(budget.id.length - 3));
        if (id > maxID) maxID = id;
      }

      let nextID: number | string = maxID + 1;
      while (!this.isUniqueID(budgets, this.clientID, this.projectID, nextID.toString())) nextID++;

      if (nextID < 100) nextID = '0'.repeat(3 - digitCount(nextID)) + nextID;
      this.budget.id = this.clientID.replace(/\D/g,'') + this.projectID.replace(/\D/g,'') + nextID;
    }));
  }

  addItem(item?: BudgetItem): void {
    const index = this.data.length;

    this.items.push({
      quantity: item ? item.quantity : 1,
      description: item ? item.description : null,
      hours: item ? item.hours : 0,
      price: item ? item.price : 0
    });

    this.data.push([
      {type: TableDataType.INPUT_NUMBER, content: {
          size: 6,
          id: 'quantity-item-' + (index + 1),
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
          id: 'description-item-' + (index + 1),
          form: this.f,
          value: this.items[index].description,
          placeholder: 'Brief item description',
          required: true,
          requiredErrorMessage: 'A description is required',
        }
      },
      {type: TableDataType.INPUT_NUMBER, content: {
          size: 8,
          id: 'hours-item-' + (index + 1),
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
          id: 'price-item-' + (index + 1),
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
    console.log(this.data)

    this.totalHours += this.items[index].hours;
    this.totalPrice += this.items[index].price;
    this.updateValues(index);
  }

  async updateValues(index: number, col?: number): Promise<void> {
    if (this.data.length > 0) {
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
        if (colChanged === 'hours') {
          if (this.items[index].hours === null && this.items[index].price !== null) {
            this.totalPrice = 0;
            this.items[index].price = null;
            this.f.controls['price-item-' + (index + 1)].setValue(null);

          } else if (this.items[index].hours !== null && !this.isCorrectPrice(this.items[index].hours, this.items[index].price, rate) && this.f.controls['price-item-' + (index + 1)]) {
            const price = this.calculatePrice(this.items[index].hours, rate);
            this.totalPrice += price - this.items[index].price;
            this.items[index].price = price;
            this.f.controls['price-item-' + (index + 1)].setValue(price);
          }

        } else if (colChanged === 'price') {
          if (this.items[index].price === null && this.items[index].hours !== null) {
            this.totalHours = 0;
            this.items[index].hours = null;
            this.f.controls['hours-item-' + (index + 1)].setValue(null);

          } else if (this.items[index].price !== null && !this.isCorrectHours(this.items[index].hours, this.items[index].price, rate) && this.f.controls['hours-item-' + (index + 1)]) {
            const hours = this.calculateHours(this.items[index].price, rate);
            this.totalHours += hours - this.items[index].hours;
            this.items[index].hours = hours;
            this.f.controls['hours-item-' + (index + 1)].setValue(hours);
          }
        }
      }

      // Update totals
      this.footers = [
        'Total',
        '',
        hoursToString(this.totalHours),
        numberWithCommas(this.totalPrice) + ' €',
        ''
      ];
    }
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
    if (col === 0) this.items[row].quantity = value;
    else if (col === 1) this.items[row].description = value;
    else if (col === 2) {
      this.totalHours += value - this.items[row].hours;
      this.items[row].hours = value;
    }
    else if (col === 3) {
      this.totalPrice += value - this.items[row].price;
      this.items[row].price = value;
    }
    this.updateValues(row, col);
  }

  doAction(action: string, index: number): void {
    if (action === 'delete') {
      this.items.splice(index, 1);
      this.data.splice(index, 1);

      // Delete form controls
      this.f.form.removeControl('quantity-item-' + (index + 1));
      this.f.form.removeControl('description-item-' + (index + 1));
      this.f.form.removeControl('hours-item-' + (index + 1));
      this.f.form.removeControl('price-item-' + (index + 1));
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
        isUniqueID = true;
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
          this.f.resetForm();
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
          this.f.resetForm();
          this.goBack();
        });

      } else {
        console.error("Invalid mode!");
        this.f.resetForm();
        this.goBack();
      }

    } else {
      this.alertService.showAlert("Error", "Invalid form. Please fix the errors and submit again.", 'danger');
    }
  }

  isUniqueID(budgets: Budget[], clientID: string, projectID: string, id: string): boolean {
    const IDs: string[] = [];
    for (let budget of budgets) {
      if (budget.client.id === clientID && budget.project.id === projectID)
        IDs.push(budget.id.replace(/\D/g,''));
    }
    return !IDs.includes(id.replace(/\D/g,''));
  }

  goBack() {
    this.router.navigate(['dashboard/budgets']).then(r => r);
  }

}
