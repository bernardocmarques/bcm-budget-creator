import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';

import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';

import {AlertService} from '../_util/alert.service';
import {FirebaseService} from "./firebase.service";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  public auth: AngularFireAuth;
  public currentUser: firebase.User = null;
  public isUserLoggedIn: boolean = false;

  private subscribersUserChange = [];

  constructor(
    private firebaseService: FirebaseService,
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private alertService: AlertService,
    private zone: NgZone
  ) {

    const that = this;
    that.auth = firebaseAuth;

    firebaseAuth.onAuthStateChanged(user => {
      that.currentUser = user;
      that.isUserLoggedIn = !!that.currentUser;
      that.notifyUserChange();

      console.log("logged in: " + that.isUserLoggedIn)
      if (that.isUserLoggedIn) {
        console.log(that.currentUser.email)
        console.log(that.currentUser.uid)
      }

      // if (that.isUserLoggedIn) {
      //   // if (this.router.url === '/' || this.router.url === '/login' || this.router.url === '/create-account')
      //   //   zone.run(() => this.router.navigate(['/dashboard']));
      //
      //   // that.firebaseService.uid = that.currentUser.uid;
      //   // that.firebaseService.userDocument = that.firestore.collection("users").doc(that.currentUser.uid);
      //
      // }
      // else zone.run(() => this.router.navigate(['/']));
    });
  }

  subscribeUserChange(obj): void {
    this.subscribersUserChange.push(obj);
  }

  notifyUserChange(): void {
    this.subscribersUserChange.forEach(sub => {
      sub.notifyUserChange(this.isUserLoggedIn);
    });
  }


  /*** --------------------------------------------- ***/
  /*** -------------- Create Account --------------- ***/
  /*** --------------------------------------------- ***/

  async createAccountWithEmail(email: string, password: string): Promise<void> {
    // TODO
  }

  async createAccountWithGoogle(): Promise<void> {
    // TODO
  }

  async createAccountWithFacebook(): Promise<void> {
    // TODO
  }


  /*** --------------------------------------------- ***/
  /*** ------------------- Login ------------------- ***/
  /*** --------------------------------------------- ***/

  async loginWithEmail(email: string, password: string): Promise<void> {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => this.alertService.showAlert('Welcome back 😊', 'Successful login', 'success'))
      .catch(error => {
        if (error.code === 'auth/user-not-found')
          this.alertService.showAlert('Account not found', 'There\'s no account linked to this email address. Please create one.', 'warning');
        if (error.code === 'auth/wrong-password')
          this.alertService.showAlert('Wrong password', 'This password is incorrect. Please try again.', 'danger');
        else
          this.alertService.showAlert('Error: ' + error.code, error.message, 'danger');
      });
  }

  async loginWithGoogle(): Promise<void> {
    // TODO
  }

  async loginWithFacebook(): Promise<void> {
    // TODO
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Logout ------------------- ***/
  /*** --------------------------------------------- ***/

  logout(hideAlert?: boolean): Promise<void> {
    return this.firebaseAuth
      .signOut()
      .then(() => {
        if (!hideAlert) this.alertService.showAlert('See you soon 👋', 'Successful logout', 'success');
      })
      .catch(error => this.alertService.showAlert('Error: ' + error.code, error.message, 'danger'))
      .finally(() => {
        this.router.navigate(['/login']).then(r => r);
      });
  }


  /*** --------------------------------------------- ***/
  /*** -------------- Reset Password --------------- ***/
  /*** --------------------------------------------- ***/

  async sendPasswordResetEmail(email: string): Promise<void> {
    return this.firebaseAuth.sendPasswordResetEmail(email);
  }

}
