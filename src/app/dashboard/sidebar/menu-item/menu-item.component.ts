import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as eva from 'eva-icons';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  animations: [
    trigger('grow', [
      state('closed', style({
        opacity: .25,
        maxHeight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0
      })),
      state('opened', style({
        opacity: 1,
        maxHeight: '36rem',
      })),
      transition('closed<=>opened', animate('300ms ease-in-out'))
    ])
  ]
})
export class MenuItemComponent implements OnInit, AfterViewInit {

  @Input() label: string;
  @Input() icon: string;
  @Input() route: string;
  @Input() items?: {label: string, route: string}[];

  routes?: string[] = [];

  isMenuOpen = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
    if (this.items)
      this.items.forEach(item => this.routes.push(item.route));
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  toggleMenu(e): void {
    this.isMenuOpen = !this.isMenuOpen;
    e.stopPropagation();
  }

  isActive(): boolean {
    for (const route of this.routes) {
      if (this.router.isActive('/dashboard/' + route, true)) return true;
    }
    return false;
  }

}
