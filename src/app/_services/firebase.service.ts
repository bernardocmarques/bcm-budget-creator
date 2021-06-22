import {Injectable} from '@angular/core';

import {AngularFirestoreDocument} from "@angular/fire/firestore";
import {Client} from "../_domain/client";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  uid: string;
  userDocument: AngularFirestoreDocument;

  constructor() { }


  /*** --------------------------------------------- ***/
  /*** -------- General Database Functions --------- ***/
  /*** --------------------------------------------- ***/

  public setDatabaseData(path: string, key: string, data: any) {
    return this.userDocument.collection(path).doc(key).set(data);
  }

  public getDatabaseData(path: string) {
    return this.userDocument.collection(path).get().toPromise();
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Clients ------------------ ***/
  /*** --------------------------------------------- ***/

  public addClient(client: Client) {
    return this.userDocument.collection("clients").add(client.toObject());
  }

  public setClient(client: Client) {
    return this.userDocument.collection("clients").doc(client.key).set(client.toObject());
  }

  public deleteClientByKey(key) {
    return this.userDocument.collection("clients").doc(key).delete();
  }

  public getAllClients(): Promise<Client[]> {
    return this.userDocument.collection("clients/").get().toPromise()
      .then(querySnapshot => querySnapshot.docs.map(doc => new Client(doc.data(), doc.id)));
  }

  public getClientByKey(key: string): Promise<Client> {
    return this.userDocument.collection("clients/").doc(key).get().toPromise().then(doc => new Client(doc.data(), doc.id));
  }

}
