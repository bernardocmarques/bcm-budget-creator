import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as eva from 'eva-icons';
import {Budget, BudgetItem} from "../../../_domain/budget";
import {TableDataType} from "../../../_components/tables/table-data/table-data.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CacheService} from "../../../_services/cache.service";
import {numberWithCommas} from "../../../_util/number";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, AfterViewInit {

  budget: Budget;
  loading: boolean;

  headers: {label: string, value: any}[];
  footers: string[];
  data: {type: TableDataType, content: any}[][];
  items: BudgetItem[];
  totalHours: number = 0;
  totalPrice: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cacheService: CacheService
  ) {

    this.loading = true;

    this.route.params.subscribe(params => {
      this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
        for (const budget of budgets)
          if (budget.key === params.id) {
            this.budget = new Budget(budget, budget.key);
            this.loading = false;
          }
      }));
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

  }

}
