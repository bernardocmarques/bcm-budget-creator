import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {getStatusString, Project, Status} from "../../../_domain/project";
import {NgForm} from "@angular/forms";
import {FirebaseService} from "../../../_services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "../../../_services/theme.service";
import {AlertService} from "../../../_services/alert.service";
import {CacheService} from "../../../_services/cache.service";
import * as eva from 'eva-icons';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit, AfterViewInit {

  project: Project;
  loading: boolean;

  clients:  {value: string, text: string}[];
  clientID: string;

  status: {value: Status, text: string}[] = [
    {value: Status.IN_PROGRESS, text: getStatusString(Status.IN_PROGRESS)},
    {value: Status.COMPLETED, text: getStatusString(Status.COMPLETED)},
  ];

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

    this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
      this.clients = clients.map(client => ({value: client.id, text: client.name}));
    }));

    if (this.router.url.includes('edit')) {
      this.mode = "edit";
      this.route.params.subscribe(params => {
        this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
          for (const project of projects)
            if (project.key === params.id) {
              this.project = new Project(project, project.key);
              this.clientID = project.client.id;
              this.loading = false;
            }
        }));
      }).unsubscribe();

    } else {
      this.mode = "add";
      this.project = new Project({});
      this.initID();
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  async onSubmit() {
    if (this.f.form.valid) {
      this.processing = true;
      const projectToUpdate = new Project(this.project, this.project.key);
      await this.cacheService.getUserClients().then(obs => obs.subscribe(clients => {
        clients.forEach(client => {
          if (client.id === this.clientID)
            projectToUpdate.client = client;
        });
      }));
      projectToUpdate.status = !this.project.status ? Status.IN_PROGRESS : parseInt(this.project.status as unknown as string);

      if (this.mode == "add") {
        this.firebaseService.addProject(projectToUpdate).then(() => {
          this.cacheService.userProjects = null;
          this.alertService.showAlert('New project created!', 'New project successfully created.', 'success');

        }).catch((error) => {
          this.alertService.showAlert('Error', 'Error writing document: ' + error, 'danger');

        }).finally(() => {
          this.processing = false;
          this.f.resetForm();
          this.goBack();
        });

      } else if (this.mode == "edit") {
        this.firebaseService.setProject(projectToUpdate).then(() => {
          this.cacheService.userProjects = null;
          this.alertService.showAlert('Changes saved!', 'Project ' + this.project.name + ' successfully edited.', 'success');

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

  initID(): void {
    this.cacheService.getUserProjects().then(obs => obs.subscribe(projects => {
      let maxID: number = 0;
      for (let project of projects) {
        const id = parseInt(project.id);
        if (id > maxID) maxID = id;
      }

      if (maxID) {
        const nextID = maxID + 1;
        this.project.id = nextID < 10 ? '0' + nextID : nextID.toString();
      }
    }));
  }

  goBack() {
    this.router.navigate(['dashboard/projects']).then(r => r);
  }

}
