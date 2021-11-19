import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip, ApexGrid
} from "ng-apexcharts";
import {printMoney} from "../../../../_util/number";
import {ThemeService} from "../../../../_services/theme.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  labels: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  grid: ApexGrid;
};

@Component({
  selector: 'app-earnings-over-time',
  templateUrl: './earnings-over-time.component.html',
  styles: [
  ]
})
export class EarningsOverTimeComponent implements OnInit, OnChanges {

  @Input() data: any;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  GRID = { light: '#f4f5f7', dark: '#27303f' };
  TEXT = { light: '#4c4f52', dark: '#9e9e9e' };
  CHART = { light: '#6875f5', dark: '#6875f5' };

  constructor(
    private themeService: ThemeService
  ) {

    // Update chart on theme change
    themeService.update.subscribe(isDark => {
      console.log(this.chartOptions)
      this.chartOptions.colors = [this.CHART[isDark ? 'dark' : 'light']]
      this.chartOptions.grid.borderColor = this.GRID[isDark ? 'dark': 'light'];
      this.chartOptions.xaxis.labels.style.colors = this.TEXT[isDark ? 'dark': 'light'];
      this.chartOptions.yaxis.labels.style.colors = this.TEXT[isDark ? 'dark': 'light'];
      this.chart.updateOptions(this.chartOptions);
    });
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        { name: 'Earnings', data: this.data }
      ],
      chart: {
        type: 'area',
        height: 300,
        width: '100%',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: [this.CHART[this.themeService.isDark() ? 'dark' : 'light']],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: 'd MMM',
          style: {
            fontFamily: 'Inter, sans-serif',
            colors: this.TEXT[this.themeService.isDark() ? 'dark': 'light']
          }
        },
        tooltip: { enabled: false }
      },
      yaxis: {
        labels: {
          formatter: val => printMoney(val),
          style: {
            fontFamily: 'Inter, sans-serif',
            colors: this.TEXT[this.themeService.isDark() ? 'dark': 'light']
          }
        }
      },
      tooltip: {
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      },
      grid: {
        borderColor: this.GRID[this.themeService.isDark() ? 'dark': 'light']
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data && changes?.data.previousValue !== undefined) {
      this.ngOnInit();
      this.chart.updateOptions(this.chartOptions);
    }
  }


}
