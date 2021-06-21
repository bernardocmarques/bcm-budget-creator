import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeDarkService {

  private _darkTheme: boolean;

  constructor() { }

  get darkTheme(): boolean {
    return this._darkTheme;
  }

  set darkTheme(value: boolean) {
    this._darkTheme = value;
  }

  getThemeFromLocalStorage(): boolean {
    // if already set
    if (this.darkTheme !== null) return this.darkTheme;

    // else if user already changed the theme, use it
    if (window.localStorage.getItem('dark'))
      return JSON.parse(window.localStorage.getItem('dark'));

    // else return their preferences
    return (!!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  setThemeToLocalStorage(value): void {
    window.localStorage.setItem('dark', value);
    this.darkTheme = value;
  }
}
