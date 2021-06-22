import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

import * as eva from 'eva-icons';
import {Router} from "@angular/router";
import {AlertService} from "../../_services/alert.service";
import {FirebaseAuthService} from "../../_services/firebase-auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  email: string;
  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    public router: Router,
    private alertService: AlertService,
    private firebaseAuthService: FirebaseAuthService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit(): Promise<void> {
    if (this.f.form.valid) {
      await this.firebaseAuthService.sendPasswordResetEmail(this.email);
      this.alertService.showAlert('Recovery e-mail sent', 'We\'ve sent a password recovery e-mail to the address submitted. If you don\' receive any e-mail, please check SPAM.', 'success');
      this.router.navigate(['/login']);

    } else {
      this.alertService.showAlert('Error', 'Please submit a valid e-mail address.', 'danger');
    }
  }

}
