import {Client} from './client';
import {Project} from './project';
import {printMoney} from "../_util/number";

export interface BudgetItem {
  id?: number;
  quantity: number;
  description: string;
  price: number;
  hours: number;
}

export enum Status {
  IN_PROGRESS,
  FOR_PAYMENT,
  PAID,
  DENIED
}

export function getStatusString(status: Status): string {
  switch (status) {
    case Status.IN_PROGRESS:
      return 'In Progress';
    case Status.FOR_PAYMENT:
      return 'For Payment';
    case Status.PAID:
      return 'Paid';
    case Status.DENIED:
      return 'Denied';
    default:
      return 'No status';
  }
}

export class Budget {
  key?: string = null;
  id: string = null;
  client: Client = null;
  project: Project = null;
  items: BudgetItem[] = null;
  pdfLink: string = null;
  status: Status = 0;
  totalPaid: number = 0;

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
      client_name_2: this.client.company ? this.client.company : '-',
      nr_items: this.items.length,
      items: this.items
    }
  }

  toObject(): Object {
    return Object.assign({}, this);
  }

  getStatusInfo(): { text: string, color: string } {
    switch (this.status) {
      case Status.IN_PROGRESS:
        return { text: 'In Progress', color: 'blue' };
      case Status.FOR_PAYMENT:
        return { text: 'For Payment - ' + printMoney(this.getTotalPrice() - this.totalPaid), color: 'pink' };
      case Status.PAID:
        return { text: 'Paid', color: 'green' };
      case Status.DENIED:
        return { text: 'Denied', color: 'red' };
      default:
        return { text: 'No status', color: 'gray' }
    }
  }

  getNextStatusActionInfo(): { text: string, icon: string } {
    switch (this.status) {
      case Status.IN_PROGRESS:
        return { text: 'Mark for payment', icon: 'checkmark-circle-outline' };
      case Status.FOR_PAYMENT:
        return { text: 'Make payment', icon: 'credit-card-outline' };
      default:
        return { text: 'No action', icon: 'flash-outline' }
    }
  }

  getTotalPrice(): number {
    return this.items.map(item => item.quantity * item.price).reduce((total, value) => total + value);
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
  totalPaid: number = 0;

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


