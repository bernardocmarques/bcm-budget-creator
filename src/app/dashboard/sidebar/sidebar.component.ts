import {Component, HostListener, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('slideFromLeft', [
      state('closed', style({
        opacity: 0,
        transform: 'translateX(-5rem)'
      })),
      state('opened', style({
        opacity: 1,
      })),
      transition('closed<=>opened', animate('150ms ease-in-out'))
    ]),
    trigger('fade', [
      state('initial', style({
        opacity: 0,
      })),
      state('final', style({
        opacity: 1,
      })),
      transition('initial<=>final', animate('150ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit {

  @Input() isSidebarOpen;
  mobileView;

  constructor() { }

  ngOnInit(): void {
    this.onWindowResize();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.mobileView = window.innerWidth <= 767.99; // phones & tablets
    this.isSidebarOpen = !this.mobileView;
  }

}
