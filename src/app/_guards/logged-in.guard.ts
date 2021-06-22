import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {FirebaseAuthService} from "../_services/firebase-auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate, CanActivateChild {

  constructor(private firebaseAuthService: FirebaseAuthService, private router: Router) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve, reject) => {
      const unsubscribe = this.firebaseAuthService.auth.onAuthStateChanged(async user => {
        (await unsubscribe)();
        if (user != null) {
          resolve(true);
        } else {
          resolve(this.router.parseUrl("/login"));
        }
      }, reject);
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve, reject) => {
      const unsubscribe = this.firebaseAuthService.auth.onAuthStateChanged(async user => {
        (await unsubscribe)();
        if (user != null) {
          resolve(true);
        } else {
          resolve(this.router.parseUrl("/login"));
        }
      }, reject);
    });
  }

}
