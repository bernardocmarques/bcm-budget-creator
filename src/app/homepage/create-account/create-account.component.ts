import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

import * as eva from 'eva-icons';

import {AlertService} from "../../_util/alert.service";
import {FirebaseAuthService} from "../../_services/firebase-auth.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnInit, AfterViewInit {

  darkTheme = this.getThemeFromLocalStorage();

  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private alertService: AlertService,
    private firebaseAuthService: FirebaseAuthService,
    public router: Router
  ) {
    if (this.darkTheme)
      document.querySelector('html').classList.add('theme-dark');
    this.setThemeToLocalStorage(this.darkTheme);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit(): Promise<void> {
    if (this.f.form.valid) {
      if (!this.passwordsAreEqual()) {
        this.f.form.controls.confirmPasswordInput.setErrors({doNotMatch: true});
        this.alertService.showAlert('Error', 'Passwords do not match. Please try again.', 'danger');
        return;
      }
      await this.firebaseAuthService.createAccountWithEmail(this.email, this.password);

    } else {
      this.alertService.showAlert('Error', 'Invalid form. Please fill in missing and/or invalid information.', 'danger');
    }
  }

  passwordsAreEqual(): boolean {
    return this.password === this.confirmPassword;
  }

  async createAccountWithGoogle(): Promise<void> {
    await this.firebaseAuthService.createAccountWithGoogle();
  }

  async createAccountWithFacebook(): Promise<void> {
    await this.firebaseAuthService.createAccountWithFacebook();
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
