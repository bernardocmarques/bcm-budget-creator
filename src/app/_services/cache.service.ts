import {Injectable, Injector} from '@angular/core';
import {from, Observable} from "rxjs";
import {Client} from "../_domain/client";
import {FirebaseService} from "./firebase.service";
import {publishReplay, refCount} from "rxjs/operators";
import {Budget} from "../_domain/budget";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  firebaseService: FirebaseService;

  userClients: Observable<Client[]>;
  userBudgets: Observable<Budget[]>;

  constructor(private injector: Injector) { }

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
    this.userBudgets = null;
  }
}
