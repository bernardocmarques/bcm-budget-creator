import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-theme-toggler',
  templateUrl: './theme-toggler.component.html'
})
export class ThemeTogglerComponent implements OnInit {

  darkTheme = this.getThemeFromLocalStorage();

  constructor() {
    if (this.darkTheme)
      document.querySelector('html').classList.toggle('theme-dark');
  }

  ngOnInit(): void {
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    document.querySelector('html').classList.toggle('theme-dark');
    this.setThemeToLocalStorage(this.darkTheme);
  }

  getThemeFromLocalStorage(): boolean {
    // if user already changed the theme, use it
    if (window.localStorage.getItem('dark'))
      return JSON.parse(window.localStorage.getItem('dark'));

    // else return their preferences
    return (!!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  setThemeToLocalStorage(value): void {
    window.localStorage.setItem('dark', value);
  }

}
