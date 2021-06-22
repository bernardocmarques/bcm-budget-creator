import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

import * as eva from 'eva-icons';

import {AlertService} from "../../_services/alert.service";
import {FirebaseAuthService} from "../../_services/firebase-auth.service";
import {ThemeService} from "../../_services/theme.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  email: string;
  password: string;

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private alertService: AlertService,
    public firebaseAuthService: FirebaseAuthService,
    public router: Router,
    private themeService: ThemeService
  ) {
    if (this.themeService.isDark())
      document.querySelector('html').classList.add('theme-dark');
    this.themeService.setTheme(this.themeService.getTheme());

    if (this.firebaseAuthService.isUserLoggedIn) {
      this.router.navigate(['/dashboard']).then(r => r);

    } else {
      firebaseAuthService.subscribeUserChange(this);
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  notifyUserChange(isLoggedIn) {
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']).then(r => r);
    }
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
