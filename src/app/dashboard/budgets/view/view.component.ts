import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as eva from 'eva-icons';
import {Budget, BudgetItem} from "../../../_domain/budget";
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CacheService} from "../../../_services/cache.service";
import {numberWithCommas} from "../../../_util/number";
import {FirebaseService} from "../../../_services/firebase.service";
import {GoogleScriptsService} from "../../../_services/google-scripts.service";
import {AlertService} from "../../../_services/alert.service";


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, AfterViewInit {

  budget: Budget;
  loading: boolean;
  generatingPDF: boolean;

  headers: {label: string, value: any}[];
  footers: string[];
  data: {type: TableDataType, content: any}[][];
  items: BudgetItem[];
  totalHours: number = 0;
  totalPrice: number = 0;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private googleScriptsService: GoogleScriptsService,
    private alertService: AlertService
  ) {

    this.loading = true;

    this.route.params.subscribe(params => {
      setTimeout(() => {
        this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
          for (const budget of budgets)
            if (budget.key === params.id) {
              this.budget = new Budget(budget, budget.key);
              this.loading = false;
            }
        }));
      }, 0);
    }).unsubscribe();
  }

  ngOnInit(): void {
    this.headers = [
      {label: 'quantity', value: 'no-sort-filter'},
      {label: 'description', value: 'no-sort-filter'},
      {label: 'hours', value: 'no-sort-filter'},
      {label: 'price', value: 'no-sort-filter'}
    ];

    this.data = [];
    this.items = [];
    this.budget.items.forEach(item => this.addItem(item));
    this.footers = [
      'Total',
      '',
      this.totalHours + ' hours',
      numberWithCommas(this.totalPrice) + ' €'
    ];
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  addItem(item?: BudgetItem): void {
    const index = this.data.length;

    this.items.push({
      quantity: item ? item.quantity : 1,
      description: item ? item.description : null,
      hours: item ? item.hours : null,
      price: item ? item.price : null
    });

    this.data.push([
      {type: TableDataType.TEXT, content: this.items[index].quantity},
      {type: TableDataType.TEXT, content: this.items[index].description},
      {type: TableDataType.TEXT, content: this.items[index].hours},
      {type: TableDataType.MONEY, content: this.items[index].price}
    ]);

    this.totalHours += this.items[index].hours;
    this.totalPrice += this.items[index].price;
  }

  openPDF(url: string): void {
    window.open(url, "_blank");
  }

  generatePDF(): void {
    if (this.generatingPDF) return;
    this.generatingPDF = true;

    this.firebaseService.getTemplateLink().then(urlTemplate => {
      this.googleScriptsService.generatePDF(urlTemplate, this.budget).then((res => {
        if (res.link) {
          this.budget.pdfLink = res.link;

          this.firebaseService.setBudget(this.budget).then(() => {
            this.cacheService.userBudgets = null;
            this.alertService.showAlert('PDF generated!', 'PDF successfully generated.', 'success');
            this.openPDF(this.budget.pdfLink);

          }).catch((error) => {
            console.error("Error writing document: ", error);

          }).finally(() => {
            this.generatingPDF = false;
          });
        }
      }));
    });
  }

}
