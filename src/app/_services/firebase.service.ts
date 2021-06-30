import {Injectable} from '@angular/core';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {FirebaseAuthService} from "./firebase-auth.service";
import FieldValue = firebase.firestore.FieldValue;

import {User} from "../_domain/user";
import {Client} from "../_domain/client";
import {Project, ProjectDatabase} from "../_domain/project";
import {Budget, BudgetDatabase} from "../_domain/budget";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  uid: string;
  userDocument: AngularFirestoreDocument;
  userStorageRef: firebase.storage.Reference;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private firestore: AngularFirestore
  ) {
    this.uid = this.firebaseAuthService.currentUser.uid;
    this.userDocument = this.firestore.collection("users").doc(this.uid);
    this.userStorageRef = firebase.storage().ref();
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

  public getDatabaseDoc(path: string, doc: string) {
    return this.userDocument.collection(path).doc(doc).get().toPromise();
  }


  /*** --------------------------------------------- ***/
  /*** --------- General Storage Functions --------- ***/
  /*** --------------------------------------------- ***/

  public downloadImage(path: string): Promise<string> {
    // Create a reference to the file we want to download
    const ref = this.userStorageRef.child(path);

    // Get the download URL
    return ref.getDownloadURL().then(url => {
      return url;

    }).catch(function(error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      console.error('Error: ' + error.code);
    });
  }


  /*** --------------------------------------------- ***/
  /*** ------------------- User -------------------- ***/
  /*** --------------------------------------------- ***/

  public setUserInfo(user: User) {
    const obj = user.toObject();
    obj['avatar'] = user.avatar.split('/').pop();
    return this.userDocument.set(obj);
  }

  public getUserInfo(): Promise<User> {
    return this.userDocument.get().toPromise().then(doc => {
      const avatar = doc.data()['avatar'];

      // Get actual url for avatar
      if (!avatar)
        return new User(doc.data(), doc.id, null);

      if (avatar.includes('avatar-'))
        return new User(doc.data(), doc.id, 'assets/avatars/' + avatar);

      return this.downloadImage('users/' + this.uid + '/' + avatar).then(avatar =>
        new User(doc.data(), doc.id, avatar)
      );
    });
  }

  public getTemplateLink(): Promise<string> {
    return this.userDocument.get().toPromise().then(doc => doc.data()["template_url"]);
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
    return this.getDatabaseData("clients/")
      .then(querySnapshot => querySnapshot.docs.map(doc => new Client(doc.data(), doc.id)));
  }

  public getClientByKey(key: string): Promise<Client> {
    return this.getDatabaseDoc("clients/", key)
      .then(doc => new Client(doc.data(), doc.id));
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Projects ----------------- ***/
  /*** --------------------------------------------- ***/

  public addProject(project: Project) {
    return this.userDocument.collection("projects").add(project.toProjectDatabase().toObject());
  }

  public setProject(project: Project) {
    return this.userDocument.collection("projects").doc(project.key).set(project.toProjectDatabase().toObject());
  }

  public deleteProjectByKey(key) {
    return this.userDocument.collection("projects").doc(key).delete();
  }

  public getAllProjects(): Promise<Project[]> {
    return this.getAllProjectsFromClient();
  }

  public async getAllProjectsFromClient(clientKey?: string): Promise<Project[]> {
    let query = clientKey ? ref => ref.where('clientKey', '==', clientKey): undefined;

    return this.userDocument.collection("projects", query).get().toPromise()
      .then(querySnapshot =>  {
        let promises = [];
        for (const projectDatabase of querySnapshot.docs.map(doc => new ProjectDatabase(doc.data(), doc.id))) {
          let p: Promise<Project> = this.getClientByKey(projectDatabase.clientKey).then(client => projectDatabase.toProject(client));
          promises.push(p);
        }
        return Promise.all(promises).then(projects => projects);
      });
  }

  public getProjectByKey(key: string): Promise<Project> {
    return this.userDocument.collection("projects").doc(key).get().toPromise().then(doc => {
      let projectDatabase = new ProjectDatabase(doc.data(), doc.id);
      return this.getClientByKey(projectDatabase.clientKey).then(client => {
        return projectDatabase.toProject(client);
      })
    });
  }


  /*** --------------------------------------------- ***/
  /*** ------------------ Budgets ------------------ ***/
  /*** --------------------------------------------- ***/

  private incrementLastBudgetNumber(project: Project) {
    return this.userDocument.collection("projects").doc(project.key).update({"lastBudgetNumber": FieldValue.increment(1)})
  }

  public addBudget(budget: Budget) {
    this.incrementLastBudgetNumber(budget.project).then(r => r);
    return this.userDocument.collection("budgets").add(budget.toBudgetDatabase().toObject());
  }

  public setBudget(budget: Budget) {
    return this.userDocument.collection("budgets").doc(budget.key).set(budget.toBudgetDatabase().toObject());
  }

  public deleteBudgetByKey(key) {
    return this.userDocument.collection("budgets").doc(key).delete();
  }

  public getAllBudgets(): Promise<Budget[]> {
    return this.getAllBudgetsFromClientAndProject();
  }

  public async getAllBudgetsFromClientAndProject(clientKey?: string, projectKey?: string): Promise<Budget[]> {
    let query = undefined

    if (clientKey && projectKey) {
      query = ref => ref.where('clientKey', '==', clientKey).where('projectKey', '==', projectKey,);
    } else if (clientKey) {
      query = ref => ref.where('clientKey', '==', clientKey);
    } else if (projectKey) {
      query = ref => ref.where('projectKey', '==', projectKey);
    }

    return this.userDocument.collection("budgets", query).get().toPromise()
      .then(querySnapshot =>  {
        let promises = [];
        for (const budgetDatabase of querySnapshot.docs.map(doc => new BudgetDatabase(doc.data(), doc.id))) {
          let p: Promise<any> = this.getClientByKey(budgetDatabase.clientKey).then(client => {
            return this.getProjectByKey(budgetDatabase.projectKey).then(project => {
              return budgetDatabase.toBudget(client, project);
            });
          });
          promises.push(p);
        }
        return Promise.all(promises).then(budgets => {
          return budgets;
        })
      });
  }

  public getBudgetByKey(key: string): Promise<Budget> {
    return this.userDocument.collection("budgets").doc(key).get().toPromise().then(doc => {
      let budgetDatabase = new BudgetDatabase(doc.data(), doc.id);
      return this.getClientByKey(budgetDatabase.clientKey).then(client => {
        return this.getProjectByKey(budgetDatabase.projectKey).then(project => {
          return budgetDatabase.toBudget(client, project);
        });
      });
    });
  }

  public nextBudgetStatus(budget: Budget) {
    return this.userDocument.collection("budgets").doc(budget.key).update({"status": FieldValue.increment(1)})
  }

}
