import {Client} from './client';

export class Project {
  key?: string = null;
  id: string = null;
  clientKey: string = null;
  name: string = null;
  rate: number = null;
  lastBudgetNumber: number = null;

  constructor(source: Partial<Project>, key?: string) {
    for(const key in source) {
      if (this.hasOwnProperty(key)){
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  toProjectDatabase(): ProjectDatabase {
    return new ProjectDatabase(Object.assign(this, {clientKey: this.clientKey}));
  }

  equals(other: Project): boolean {
    return other && this.key && other.key && this.key == other.key;
  }

  toObject(): Object {
    return Object.assign({}, this);
  }
}

export class ProjectDatabase {
  key?: string;
  id: string = null;
  clientKey: string = null;
  name: string = null;
  rate: number = null;
  lastBudgetNumber: number  = null;

  constructor(source: Partial<ProjectDatabase>, key?: string) {
    for(const key in source){
      if(this.hasOwnProperty(key)){
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  toProject(client: Client): Project {
    return new Project(Object.assign({}, this, {client: client}));
  }

  toObject(): Object {
    return Object.assign({}, this);
  }

}


