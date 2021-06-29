import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import firebase from "firebase";
import User = firebase.User;
import {AlertService} from "../../../_services/alert.service";

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styles: [
  ]
})
export class CustomizationComponent implements OnInit {

  //user: User;

  @ViewChild('f', { static: false }) f: NgForm;

  inputs = {

  }

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    if (this.f.form.valid) {

    } else {
      this.alertService.showAlert('Error', 'Invalid form. Please fix the errors and submit again.', 'danger');
    }
  }

}
