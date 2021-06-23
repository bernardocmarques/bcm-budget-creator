export class Client {
  key?: string;
  name: string = null;
  company: string = null;
  id: string = null;
  avatar?: string = null;

  constructor(source: Partial<Client>, key?: string) {
    for (const key in source){
      if (this.hasOwnProperty(key)){
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
  }

  equals(other: Client): boolean {
    return other && this.key && other.key && this.key == other.key;
  }

  toObject(): Object {
    return Object.assign({}, this);
  }
}
