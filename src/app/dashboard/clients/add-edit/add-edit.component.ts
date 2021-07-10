import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Client } from 'src/app/_domain/client';
import {FirebaseService} from "../../../_services/firebase.service";
import {ThemeService} from "../../../_services/theme.service";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import * as eva from 'eva-icons';
import {digitCount, randomIntFromInterval} from "../../../_util/number";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit, AfterViewInit {

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
    let isUniqueID = true;
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

    if (this.f.form.valid && isUniqueID) {
      this.processing = true;
      const clientToUpdate = new Client(this.client, this.client.key);
      if (clientToUpdate.avatar) clientToUpdate.avatar = clientToUpdate.avatar.split('/').pop();

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
      const count = digitCount(clients.length);
      const MAX_ID = parseInt('9'.repeat(count === 1 ? count + 1 : count));
      let id = randomIntFromInterval(1, MAX_ID);

      while (!this.isUniqueID(clients, id.toString()))
        id = randomIntFromInterval(1, MAX_ID);

      this.client.id = id.toString();
    }));
  }

  isUniqueID(clients: Client[], id: string): boolean {
    const IDs: string[] = [];
    for (let client of clients)
      IDs.push(client.id.replace(/\D/g,''));
    return !IDs.includes(id.replace(/\D/g,''));
  }

  goBack() {
    this.router.navigate(['dashboard/clients']).then(r => r);
  }

}
