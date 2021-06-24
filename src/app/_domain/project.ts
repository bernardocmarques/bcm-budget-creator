import {Client} from './client';

export enum Status {
  IN_PROGRESS,
  COMPLETED
}

export function getStatusInfo(status: Status): { text: string, color: string } {
  switch (status) {
    case Status.IN_PROGRESS:
      return { text: 'In Progress', color: 'blue' };
    case Status.COMPLETED:
      return { text: 'Completed', color: 'green' };
    default:
      return { text: 'No status', color: 'gray' }
  }
}

export function getNextStatusActionInfo(status: Status): { text: string, icon: string } {
  switch (status) {
    case Status.IN_PROGRESS:
      return { text: 'Mark as completed', icon: 'checkmark-circle-outline' };
    default:
      return { text: 'No action', icon: 'flash-outline' }
  }
}

export class Project {
  key?: string = null;
  id: string = null;
  client: Client = null;
  name: string = null;
  rate: number = null;
  status: Status = null;
  lastBudgetNumber: number = null;

  constructor(source: Partial<Project>, key?: string) {
    for (const key in source) {
      if (this.hasOwnProperty(key)){
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  toProjectDatabase(): ProjectDatabase {
    return new ProjectDatabase(Object.assign(this, {clientKey: this.client.key}));
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
  status: Status = 0;
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


