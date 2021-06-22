import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import * as eva from 'eva-icons';

import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions, ApexResponsive,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[],
  responsive: ApexResponsive[]
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, AfterViewInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {
    chart: { width: 150, type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: -2,
          size: "65%",
          background: 'rgba(255,255,255,0.1)'
        },
        track: { show: false },
        dataLabels: {
          name: { show: false },
          value: {
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '21px',
            color: '#ffffff',
            offsetY: 10
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 390,
        options: {
          chart: { width: 110 },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: -2,
                size: "60%",
              },
              dataLabels: {
                value: {
                  fontSize: '16px',
                  offsetY: 5
                }
              }
            }
          },
        }
      }
    ]
  };

  menuItems = [
    {
      icon: 'options-2',
      title: 'Customization',
      description: 'Theme, Language, Currency'
    },
    {
      icon: 'person',
      title: 'Account',
      description: 'Personal information, Avatar'
    },
    {
      icon: 'lock',
      title: 'Security',
      description: 'Password'
    },
    {
      icon: 'bell',
      title: 'Notifications',
      description: 'Manage notifications'
    }
  ];

  itemActiveIndex: number = -1;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

}
