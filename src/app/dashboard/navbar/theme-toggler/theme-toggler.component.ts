import {Component, OnInit} from '@angular/core';
import {ThemeService} from "../../../_services/theme.service";

@Component({
  selector: 'app-theme-toggler',
  templateUrl: './theme-toggler.component.html'
})
export class ThemeTogglerComponent implements OnInit {

  constructor(public themeService: ThemeService) {
    if (themeService.isDark())
      document.querySelector('html').classList.add('theme-dark');
  }

  ngOnInit(): void {
  }

  toggleTheme(): void {
    this.themeService.setTheme(!this.themeService.getTheme());
    document.querySelector('html').classList.toggle('theme-dark');
  }

}
