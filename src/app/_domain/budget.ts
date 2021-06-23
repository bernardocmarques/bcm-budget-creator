import {Client} from './client';
import {Project} from './project';

export interface BudgetItem {
  quantity: number;
  description: string;
  price: number;
  hours: number;
}

export enum Status {
  IN_PROGRESS,
  FOR_PAYMENT,
  PAID
}

export class Budget {
  key?: string = null;
  id: string = null;
  client: Client = null;
  project: Project = null
  items: BudgetItem[] = null;
  pdfLink: string = null;
  status: Status = 0;

  constructor(source: Partial<Budget>, key?: string) {
    for (const key in source) {
      if (this.hasOwnProperty(key)) {
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  toBudgetDatabase(): BudgetDatabase {
    return new BudgetDatabase(Object.assign(this, { clientKey: this.client.key, projectKey: this.project.key }));
  }

  toBudgetInfoGScripts() {
    return {
      title: "Budget - " + this.project.name + " (" + this.id + ")",
      budget_nr: this.id,
      client_id: this.client.id,
      client_name_1: this.client.name,
      client_name_2: this.client.company,
      nr_items: this.items.length,
      items: this.items
    }
  }

  toObject(): Object {
    return Object.assign({}, this);
  }
}

export class BudgetDatabase {
  key?: string;
  id: string = null;
  clientKey: string = null;
  projectKey: string = null
  items: BudgetItem[] = null;
  pdfLink: string = null;
  status: Status = 0;


  constructor(source: Partial<BudgetDatabase>, key?: string) {
    for(const key in source){
      if(this.hasOwnProperty(key)){
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  toBudget(client: Client, project: Project): Budget {
    return new Budget(Object.assign({}, this, { client: client, project: project }));
  }

  toObject(): Object {
    return Object.assign({}, this);
  }

}


