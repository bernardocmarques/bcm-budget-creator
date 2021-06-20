import {Injectable} from '@angular/core';

import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {FirebaseAuthService} from "./firebase-auth.service";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  uid: string;
  userDocument: AngularFirestoreDocument;

  constructor(
    private firestore: AngularFirestore,
    private firebaseAuthService: FirebaseAuthService
  ) {
    if (this.firebaseAuthService.isUserLoggedIn) {
      this.uid = this.firebaseAuthService.currentUser.uid;
      this.userDocument = this.firestore.collection("users").doc(this.uid);
    }
  }


  /*** --------------------------------------------- ***/
  /*** -------- General Database Functions --------- ***/
  /*** --------------------------------------------- ***/

  public setDatabaseData(path: string, key: string, data: any) {
    return this.userDocument.collection(path).doc(key).set(data);
  }

  public getDatabaseData(path: string) {
    return this.userDocument.collection(path).get().toPromise();
  }
}
