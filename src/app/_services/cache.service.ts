import {Injectable, Injector} from '@angular/core';
import {from, Observable} from "rxjs";
import {Client} from "../_domain/client";
import {FirebaseService} from "./firebase.service";
import {publishReplay, refCount} from "rxjs/operators";
import {Budget} from "../_domain/budget";
import {Project} from "../_domain/project";
import {User} from "../_domain/user";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  firebaseService: FirebaseService;

  userClients: Observable<Client[]>;
  userProjects: Observable<Project[]>;
  userBudgets: Observable<Budget[]>;

  user: Observable<User>;

  constructor(private injector: Injector) { }


  /*** --------------------------------------------- ***/
  /*** ------------------ Clients ------------------ ***/
  /*** --------------------------------------------- ***/

  async getUserInfo(): Promise<Observable<User>> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    // Cache it once if clients value is false
    if (!this.user) {
      await this.firebaseService.getUserInfo().then(user => {
        this.user = from([user]).pipe(
          publishReplay(1),
          refCount()
        );
      });
    }
    return this.user;
  }

  setUserInfo(user: User): void {
    this.user = from([user]).pipe(
      publishReplay(1),
      refCount()
    );
  }


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
