export class User {
  key?: string;
  firstname?: string = null;
  lastname?: string = null;
  email: string = null;
  avatar?: string = null;

  constructor(source: Partial<User>, key?: string, avatar?: string) {
    for (const key in source) {
      if (this.hasOwnProperty(key)) {
        this[key] = source[key];
      }
    }
    if (key) this.key = key;
    if (avatar) this.avatar = avatar;
  }

  toObject(): Object {
    return Object.assign({}, this);
  }
}
