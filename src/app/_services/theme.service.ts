import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkTheme: boolean = null;

  constructor() { }

  getTheme(): boolean {
    // if already set
    if (this.darkTheme !== null) return this.darkTheme;

    // else if user already changed the theme, use it
    const valueStored = window.localStorage.getItem('dark');
    if (valueStored) return JSON.parse(valueStored);

    // else if user has theme defined in settings, use it
    // TODO: get from database

    // else return their preferences
    return (!!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  setTheme(value): void {
    this.darkTheme = value;
    window.localStorage.setItem('dark', value);
    // TODO: save to database
  }

  isDark(): boolean {
    return this.getTheme();
  }
}
