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

    if (!this.firebaseAuthService.isUserLoggedIn) this.router.navigate(['/login']).then(r => r);
    return this.firebaseAuthService.isUserLoggedIn;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.firebaseAuthService.isUserLoggedIn) this.router.navigate(['/login']).then(r => r);
    return this.firebaseAuthService.isUserLoggedIn;
  }

}
