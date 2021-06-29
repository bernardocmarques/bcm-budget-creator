import {Injectable, Injector} from '@angular/core';
import {EMPTY, from, Observable} from "rxjs";
import {Client} from "../_domain/client";
import {FirebaseService} from "./firebase.service";
import {catchError, publishReplay, refCount} from "rxjs/operators";
import {Budget} from "../_domain/budget";
import {Project} from "../_domain/project";
import {User} from "../_domain/user";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private firebaseService: FirebaseService;

  user: Observable<User>;

  userClients: Observable<Client[]>;
  userProjects: Observable<Project[]>;
  userBudgets: Observable<Budget[]>;

  constructor(private injector: Injector) { }


  /*** --------------------------------------------- ***/
  /*** -------------------- User ------------------- ***/
  /*** --------------------------------------------- ***/

  async getUserInfo(): Promise<Observable<User>> {
    // Inject service otherwise creates Circular Dependency error
    this.firebaseService = this.injector.get(FirebaseService);

    // Cache it once if clients value is false
    if (!this.user) {
      await this.firebaseService.getUserInfo().then(user => {
        this.user = from([user]).pipe(
          publishReplay(1),
          refCount(),
          catchError(err => {
            delete this.user;
            return EMPTY;
          })
        );
      });
    }
    return this.user;
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
          refCount(),
          catchError(err => {
            delete this.user;
            return EMPTY;
          })
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
          refCount(),
          catchError(err => {
            delete this.user;
            return EMPTY;
          })
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
          refCount(),
          catchError(err => {
            delete this.user;
            return EMPTY;
          })
        );
      });
    }
    return this.userBudgets;
  }

  clearCache(): void {
    this.user = null;
    this.userClients = null;
    this.userProjects = null;
    this.userBudgets = null;
  }
}
