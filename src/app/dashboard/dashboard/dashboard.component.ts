import {Component, HostListener, OnInit} from '@angular/core';
import {ThemeService} from "../../_services/theme.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  isSidebarOpen;
  mobileView;

  constructor(public themeService: ThemeService) {
    this.onWindowResize();
  }

  ngOnInit(): void {
  }

  toggleSidebar(e): void {
    if (e === 'close') this.isSidebarOpen = false;
    else this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.mobileView = window.innerWidth <= 767.99; // phones & tablets
    if (!this.mobileView) this.isSidebarOpen = true;
  }

}
