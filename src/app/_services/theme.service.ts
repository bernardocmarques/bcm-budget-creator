import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkTheme: boolean = null;
  private themeChange: Subject<boolean> = new Subject<boolean>();

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
    this.themeChange.next(this.darkTheme);
  }

  get update(): Subject<boolean> {
    return this.themeChange;
  }

  isDark(): boolean {
    return this.getTheme();
  }
}
