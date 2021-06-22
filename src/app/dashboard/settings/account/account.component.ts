import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import * as eva from 'eva-icons';
import {FirebaseAuthService} from "../../../_services/firebase-auth.service";
import firebase from "firebase";
import User = firebase.User;
import {NgForm} from "@angular/forms";
import {AlertService} from "../../../_services/alert.service";
import {ThemeService} from "../../../_services/theme.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit, AfterViewInit {

  user: User;

  @ViewChild('f', { static: false }) f: NgForm;

  inputs = {
    firstname: null,
    lastname: null,
    email: null,
    avatar: this.getDefaultAvatar()
  }

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private alertService: AlertService,
    public themeService: ThemeService) {
    this.user = firebaseAuthService.currentUser;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit(): Promise<void> {
    if (this.f.form.valid) {

    } else {
      this.alertService.showAlert('Error', 'Invalid form. Please fix the errors and submit again.', 'danger');
    }
  }

  getDefaultAvatar(): string {
    return this.themeService.isDark() ? 'assets/avatars/default-dark.svg' : 'assets/avatars/default.svg';
  }

}
