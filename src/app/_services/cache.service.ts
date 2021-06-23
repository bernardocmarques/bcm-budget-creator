import {Injectable, Injector} from '@angular/core';
import {from, Observable} from "rxjs";
import {Client} from "../_domain/client";
import {FirebaseService} from "./firebase.service";
import {publishReplay, refCount} from "rxjs/operators";
import {Budget} from "../_domain/budget";
import {Project} from "../_domain/project";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  firebaseService: FirebaseService;

  userClients: Observable<Client[]>;
  userProjects: Observable<Project[]>;
  userBudgets: Observable<Budget[]>;

  constructor(private injector: Injector) { }


  /*** --------------------------------------------- ***/
  /*** ------------------ Clients ------------------ ***/
  /*** --------------------------------------------- ***/

  async getUserClients(): Promise<Observable<Client[]>> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    // Cache it once if clients value is false
    if (!this.userClients) {
      await this.firebaseService.getAllClients().then(clients => {
        this.userClients = from([clients]).pipe(
          publishReplay(1),
          refCount()
        );
      });
    }
    return this.userClients;
  }

  public async getClientByKey(key: string): Promise<Client> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    if (!this.userClients)
      return this.firebaseService.getClientByKey(key);

    const subscription = this.userClients.subscribe(clients => {
      for (const client of clients) {
        if (client.key === key) {
          subscription.unsubscribe();
          return client;
        }
      }
      return null;
    });
    return null;
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Projects ----------------- ***/
  /*** --------------------------------------------- ***/

  async getUserProjects(): Promise<Observable<Project[]>> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    // Cache it once if budgets value is false
    if (!this.userProjects) {
      await this.firebaseService.getAllProjects().then(projects => {
        this.userProjects = from([projects]).pipe(
          publishReplay(1),
          refCount()
        );
      });
    }
    return this.userProjects;
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Budgets ------------------ ***/
  /*** --------------------------------------------- ***/

  async getUserBudgets(): Promise<Observable<Budget[]>> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    // Cache it once if budgets value is false
    if (!this.userBudgets) {
      await this.firebaseService.getAllBudgets().then(budgets => {
        this.userBudgets = from([budgets]).pipe(
          publishReplay(1),
          refCount()
        );
      });
    }
    return this.userBudgets;
  }

  clearCache(): void {
    this.userClients = null;
    this.userProjects = null;
    this.userBudgets = null;
  }
}
