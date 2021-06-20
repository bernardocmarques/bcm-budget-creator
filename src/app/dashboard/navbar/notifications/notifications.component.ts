import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface INotificationMenuItem {
  name: string;
  link: string;
  count: number;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  animations: [
    trigger('appear', [
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      state('opened', style({
        opacity: 1,
        display: 'block'
      })),
      transition('closed<=>opened', animate('150ms ease-in-out'))
    ])
  ]
})
export class NotificationsComponent implements OnInit {

  @ViewChild('toggleBtn') toggleBtn: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  isNotificationsMenuOpen = false;

  notificationsMenu: INotificationMenuItem[] = [
    {
      name: 'Sessões para rever',
      link: './',
      count: 0
    },
    {
      name: 'Relatórios',
      link: './',
      count: 0
    },
    {
      name: 'Alertas',
      link: './',
      count: 0
    },
  ];

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      const toggleBtn = this.toggleBtn.nativeElement;
      const toggleBtnChildren = toggleBtn.querySelectorAll('*');
      const menu = this.menu.nativeElement;

      if (e.target !== toggleBtn && e.target !== menu) {
        let clicked = false;
        for (const child of toggleBtnChildren)
          if (e.target === child) clicked = true;
        if (!clicked) this.isNotificationsMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.getNotificationsCounters();
  }

  getNotificationsCounters(): void {
    // TODO
    this.notificationsMenu[0].count = 13;
    this.notificationsMenu[1].count = 12;
  }

  hasNotifications(): boolean {
    for (const type of this.notificationsMenu) {
      if (type.count !== 0) return true;
    }
    return false;
  }

}
