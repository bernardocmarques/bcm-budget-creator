import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Client } from 'src/app/_domain/client';
import {FirebaseService} from "../../../_services/firebase.service";
import {ThemeService} from "../../../_services/theme.service";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import * as eva from 'eva-icons';
import {randomIntFromInterval} from "../../../_util/number";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit, AfterViewInit {

  MAX_ID = 99;

  client: Client;
  loading: boolean;

  mode: "edit" | "add";
  processing: boolean;

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
            if (client.key === params.id) {
              this.client = new Client(client, client.key);
              this.client.firebaseService = this.firebaseService;
              this.client.avatar = this.client.getAvatar() as string;
              this.loading = false;
            }
        }));
      }).unsubscribe();

    } else {
      this.mode = "add";
      this.client = new Client({});
      this.client.firebaseService = this.firebaseService;
      this.client.avatar = this.client.getAvatar() as string;
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit() {
    // Check if ID is unique
    let isUniqueID: boolean;
    if (this.mode === "add") {
      await this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
        if (!this.isUniqueID(clients, this.client.id)) {
          this.f.form.controls['id'].setErrors({'incorrect': true});
          isUniqueID = false;
          return;
        }
        isUniqueID = true;
      }));
    }

    if (this.f.form.valid && ((this.mode === "add" && isUniqueID) || this.mode === "edit")) {
      this.processing = true;
      const clientToUpdate = new Client(this.client, this.client.key);
      clientToUpdate.avatar = clientToUpdate.avatar.split('/').pop();

      if (this.mode == "add") {
        this.firebaseService.addClient(clientToUpdate).then(() => {
          this.cacheService.userClients = null;
          this.alertService.showAlert('New client created!', 'New client successfully created.', 'success');

        }).catch((error) => {
          this.alertService.showAlert('Error', 'Error writing document: ' + error, 'danger');

        }).finally(() => {
          this.processing = false;
          this.f.resetForm();
          this.goBack();
        });

      } else if (this.mode == "edit") {
        this.firebaseService.setClient(clientToUpdate).then(() => {
          this.cacheService.userClients = null;
          this.alertService.showAlert('Changes saved!', 'Client ' + this.client.name + ' successfully edited.', 'success');

        }).catch((error) => {
          this.alertService.showAlert('Error', 'Error writing document: ' + error, 'danger');

        }).finally(() => {
          this.processing = false;
          this.f.resetForm();
          this.goBack();
        });

      } else {
        console.error("Invalid mode!");
        this.f.resetForm();
        this.goBack();
      }

    } else {
      this.alertService.showAlert("Error", "Invalid form. Please fix the errors and submit again.", 'danger');
    }
  }

  randomizeID(): void {
    this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      let id = randomIntFromInterval(1, this.MAX_ID);
      let trials = 1;
      while (!this.isUniqueID(clients, id.toString())) {
        id = randomIntFromInterval(1, this.MAX_ID);
        trials++;
        if (trials > 10) {
          this.alertService.showAlert(
            'Not enough IDs left',
            'There are very few IDs left from ' + this.MAX_ID + ' possible IDs. Please increase the range',
            'warning');
        }
      }
      this.client.id = id.toString();
    }));
  }

  isUniqueID(clients: Client[], id: string): boolean {
    const IDs: string[] = [];
    for (let client of clients)
      IDs.push(client.id);
    return !IDs.includes(id);
  }

  goBack() {
    this.router.navigate(['dashboard/clients']).then(r => r);
  }

}
