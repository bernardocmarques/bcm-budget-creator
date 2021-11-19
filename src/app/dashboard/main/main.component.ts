import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as eva from 'eva-icons';
import {numberWithCommas, printMoney} from "../../_util/number";
import {CacheService} from "../../_services/cache.service";
import {Status} from "../../_domain/budget";
import * as moment from "moment";
import {TableDataType} from "../../_components/tables/table-data/table-data.component";

enum ShowBy {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week'
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {

  moneySVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z\" clip-rule=\"evenodd\" /></svg>";
  completedSVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" /></svg>";
  peopleSVG: string = "<svg class=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z\" /></svg>";

  cards = {
    projects: { loader: true, value: 0 },
    earnings: { loader: true, value: 0 },
    clients: { loader: true, value: 0 },
    pending: { loader: true, value: 0 }
  }

  stats = {
    timeFor: { loader: true, showBy: ShowBy.YEAR },
    earningsOverTime: { loader: true, showBy: ShowBy.YEAR, selectedTime: new Date().getFullYear(), data: [] },
    clientsByCountry: { loader: true, headers: [{label: 'Country'}, {label: '#'}], data: [] },
  }

  showByOptions: string[] = Object.values(ShowBy);

  constructor(private cacheService: CacheService) { }

  ngOnInit(): void {
    this.initCards();
    this.initCharts();
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  initCards(): void {
    this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      this.cards.clients.value = clients.length;
      this.cards.clients.loader = false;
    }));

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      let totalEarnings = 0;
      let pendingPayments = 0;

      budgets.forEach(budget => {
        if (budget.status === Status.PAID)
          budget.items.forEach(item => totalEarnings += item.price)
        if (budget.status === Status.FOR_PAYMENT) {
          pendingPayments++;
          if (budget.totalPaid > 0)
            totalEarnings += budget.totalPaid;
        }
      });

      this.cards.earnings.value = totalEarnings;
      this.cards.earnings.loader = false;
      this.cards.pending.value = pendingPayments;
      this.cards.pending.loader = false;
    }));

    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      let totalCompleted = 0;

      projects.forEach(project => {
        if (project.status === 1)
          totalCompleted++;
      })
      this.cards.projects.value = totalCompleted;
      this.cards.projects.loader = false;
    }))
  }

  initCharts(): void {
    this.initChartEarningOverTime();
    this.initClientsByCountry();
  }

  initChartEarningOverTime(): void {
    // Reset
    this.stats.earningsOverTime.loader = true;
    const stat = this.stats.earningsOverTime;
    stat.data = [];

    this.cacheService.getUserBudgets().then(obs => obs.subscribe(budgets => {
      // Sorting
      budgets = budgets.sort((a, b) => a.paidTimestamp - b.paidTimestamp);

      // Get data
      budgets.forEach(budget => {
        if (budget.status === Status.PAID) {
          const paidDate = moment(budget.paidTimestamp);

          if (stat.showBy === ShowBy.YEAR && paidDate.year() === stat.selectedTime)
            stat.data.push([paidDate.utc(), budget.getTotalPrice()]);

          else if (stat.showBy === ShowBy.MONTH && paidDate.year() === stat.selectedTime[0] && paidDate.month() === stat.selectedTime[1])
            stat.data.push([paidDate.utc(), budget.getTotalPrice()]);

          else if (stat.showBy === ShowBy.WEEK && paidDate.startOf('week').isSame(stat.selectedTime))
            stat.data.push([paidDate.utc(), budget.getTotalPrice()]);
        }
      });

      this.stats.earningsOverTime.loader = false;
    }));
  }

  initClientsByCountry(): void {
    // Reset
    this.stats.clientsByCountry.loader = true;
    const stat = this.stats.clientsByCountry;
    stat.data = [];

    this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {

      const count = {};
      clients.forEach(client => {
        if (count.hasOwnProperty(client.country)) count[client.country]++;
        else count[client.country] = 1;
      });

      Object.keys(count).sort().forEach(country => {
        stat.data.push([
          {type: TableDataType.TEXT, content: country},
          {type: TableDataType.TEXT, content: count[country]},
        ]);
      });

      this.stats.clientsByCountry.loader = false;
    }));
  }


  onShowByChange(stat: string): void {
    const today = moment().utc();

    if (this.stats[stat].showBy === ShowBy.YEAR) this.stats[stat].selectedTime = today.year();
    else if (this.stats[stat].showBy === ShowBy.MONTH) this.stats[stat].selectedTime = [today.year(), today.month()];
    else if (this.stats[stat].showBy === ShowBy.WEEK) this.stats[stat].selectedTime = today.startOf('week');

    if (stat === 'earningsOverTime') this.initChartEarningOverTime();
  }


  hasNext(stat: string): boolean {
    const showBy = this.stats[stat].showBy;
    const selectedTime = this.stats[stat].selectedTime;
    const today = moment();
    let res = false;

    if (showBy === ShowBy.YEAR)
      res = selectedTime < today.year();

    else if (showBy === ShowBy.MONTH)
      res = selectedTime[0] <= today.year() && (selectedTime[0] === today.year() ? selectedTime[1] < today.month() : true);

    else if (showBy === ShowBy.WEEK)
      res = selectedTime.clone().add(7, 'days').isBefore(today);

    eva.replace();
    return res;
  }

  previous(stat: string): void {
    const showBy = this.stats[stat].showBy;

    if (showBy === ShowBy.YEAR)
      this.stats[stat].selectedTime--;

    else if (showBy === ShowBy.MONTH) {
      if (this.stats[stat].selectedTime[1] <= 0) {
        this.stats[stat].selectedTime[0]--;
        this.stats[stat].selectedTime[1] = 11;
      } else {
        this.stats[stat].selectedTime[1]--;
      }
    }

    else if (showBy === ShowBy.WEEK)
      this.stats[stat].selectedTime = this.stats[stat].selectedTime.clone().subtract(7, 'days');

    if (stat === 'earningsOverTime') this.initChartEarningOverTime();
  }

  next(stat: string): void {
    const showBy = this.stats[stat].showBy;

    if (showBy === ShowBy.YEAR)
      this.stats[stat].selectedTime++;

    else if (showBy === ShowBy.MONTH) {
      if (this.stats[stat].selectedTime[1] >= 11) {
        this.stats[stat].selectedTime[0]++;
        this.stats[stat].selectedTime[1] = 0;
      } else {
        this.stats[stat].selectedTime[1]++;
      }
    }

    else if (showBy === ShowBy.WEEK)
      this.stats[stat].selectedTime = this.stats[stat].selectedTime.clone().add(7, 'days');

    if (stat === 'earningsOverTime') this.initChartEarningOverTime();
  }


  formatNumber(value: number): string {
    return numberWithCommas(value);
  }

  formatMoney(value: number): string {
    return printMoney(value);
  }

  formatTime(stat: string): string {
    const showBy = this.stats[stat].showBy;
    const selectedTime = this.stats[stat].selectedTime;

    if (showBy === ShowBy.YEAR)
      return selectedTime.toString();

    else if (showBy === ShowBy.MONTH)
      return moment().month(selectedTime[1]).format('MMM') + ' ' + selectedTime[0].toString();

    else if (showBy === ShowBy.WEEK)
      return selectedTime.format('DD/MM/YYYY') + ' - ' + selectedTime.clone().add(7, 'days').format('DD/MM/YYYY');

    return '';
  }

}
