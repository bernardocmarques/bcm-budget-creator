import {Component, OnInit} from '@angular/core';
import {ThemeDarkService} from "../../../_services/theme-dark.service";

@Component({
  selector: 'app-theme-toggler',
  templateUrl: './theme-toggler.component.html'
})
export class ThemeTogglerComponent implements OnInit {

  darkTheme = this.darkThemeService.getThemeFromLocalStorage();

  constructor(private darkThemeService: ThemeDarkService) {
    if (this.darkTheme)
      document.querySelector('html').classList.add('theme-dark');
  }

  ngOnInit(): void {
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.querySelector('html').classList.toggle('theme-dark');
    this.darkThemeService.setThemeToLocalStorage(this.darkTheme);
  }

}
