import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

import * as eva from 'eva-icons';

import {AlertService} from "../../_util/alert.service";
import {FirebaseAuthService} from "../../_services/firebase-auth.service";
import {ThemeDarkService} from "../../_services/theme-dark.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  darkTheme = this.darkThemeService.getThemeFromLocalStorage();

  email: string;
  password: string;

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private alertService: AlertService,
    public firebaseAuthService: FirebaseAuthService,
    public router: Router,
    private darkThemeService: ThemeDarkService
  ) {
    if (this.darkTheme)
      document.querySelector('html').classList.add('theme-dark');
    this.darkThemeService.setThemeToLocalStorage(this.darkTheme);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit(): Promise<void> {
    if (this.f.form.valid)
      await this.firebaseAuthService.loginWithEmail(this.email, this.password);
    else
      this.alertService.showAlert('Error', 'Invalid login. Please try again.', 'danger');
  }

  async loginWithGoogle(): Promise<void> {
    // TODO
  }

  async loginWithFacebook(): Promise<void> {
    // TODO
  }

}
