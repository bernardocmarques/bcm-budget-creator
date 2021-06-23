import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Client } from 'src/app/_domain/client';
import {FirebaseService} from "../../../_services/firebase.service";
import {ThemeService} from "../../../_services/theme.service";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import * as eva from 'eva-icons';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit, AfterViewInit {

  client: Client;
  loading: boolean;

  mode: "edit" | "add";

  @ViewChild('f', { static: false }) f: NgForm;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private alertService: AlertService,
    private cacheService: CacheService
  ) {
    this.loading = true;

    if (this.router.url.includes('edit')) {
      this.mode = "edit";
      this.route.params.subscribe(params => {
        this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
          for (const client of clients)
            if (client.key === params.id){
              this.client = client;
              this.loading = false;
            }
        }));
      }).unsubscribe();
    } else {
      this.mode = "add";
      this.client = new Client({});
      this.client.avatar = this.getDefaultAvatar();
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  onSubmit() {
    if (this.f.form.valid) {
      if (this.mode == "add") {
        console.log(this.client);
        // this.firebaseService.addClient(this.client).then(() => {
        //   console.log("Document successfully written!");
        // }).catch((error) => {
        //   console.error("Error writing document: ", error);
        // }).finally(() => {
        //   this.f.resetForm();
        //   this.goBack();
        // });

      } else if (this.mode == "edit") {
        // this.firebaseService.setClient(this.client).then(() => {
        //   console.log("Document successfully written!");
        // }).catch((error) => {
        //   console.error("Error writing document: ", error);
        // }).finally(() => {
        //   this.f.resetForm();
        //   this.goBack();
        // });

      } else {
        console.error("Invalid mode!");
        this.f.resetForm();
        this.goBack();
      }

    } else {
      this.alertService.showAlert("Error", "Invalid Form. Please try again.", 'danger');
    }
  }

  getDefaultAvatar(): string {
    return this.themeService.isDark() ? 'assets/avatars/default-dark.svg' : 'assets/avatars/default.svg';
  }

  goBack() {
    this.router.navigate(['dashboard/clients']).then(r => r);
  }

}
