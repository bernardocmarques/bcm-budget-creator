import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

import * as eva from 'eva-icons';

import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions, ApexResponsive,
  ChartComponent
} from "ng-apexcharts";
import {NgForm} from "@angular/forms";
import {CacheService} from "../../_services/cache.service";
import {ActivatedRoute, Route, Router} from "@angular/router";

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

  percentageProfileCompleted: number = 0;
  NUMBER_FIELDS = 4;

  @ViewChild('f', { static: false }) f: NgForm;
  @Output() saveChangesBtnClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private cacheService: CacheService,
    private router: Router
  ) {
    const activeItem = router.url.split('/').pop();
    switch (activeItem) {
      case 'customization':
        this.itemActiveIndex = 0;
        break;

      case 'account':
        this.itemActiveIndex = 1;
        break;

      case 'security':
        this.itemActiveIndex = 2;
        break;

      case 'notifications':
        this.itemActiveIndex = 3;
        break;

      default:
        this.itemActiveIndex = -1;
    }
  }

  ngOnInit(): void {
    this.cacheService.getUserInfo().then(obs => obs.subscribe(user => {
      let fields = 0;
      if (user.firstname) fields++;
      if (user.lastname) fields++;
      if (user.email) fields++;
      if (user.avatar) fields++;
      this.percentageProfileCompleted = fields * 100 / this.NUMBER_FIELDS;
    }));
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

}
