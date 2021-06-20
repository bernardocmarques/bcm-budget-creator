import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from "../../_services/firebase-auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {

  constructor(public firebaseAuthService: FirebaseAuthService) { }

  ngOnInit(): void {
  }

}
