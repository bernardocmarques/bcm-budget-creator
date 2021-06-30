import {FirebaseService} from "../_services/firebase.service";
import {ThemeService} from "../_services/theme.service";

export class Client {
  key?: string;
  name: string = null;
  company?: string = null;
  id: string = null;
  avatar?: string = null;

  public firebaseService: FirebaseService;
  public themeService: ThemeService;

  constructor(source: Partial<Client>, key?: string) {
    for (const key in source) {
      if (this.hasOwnProperty(key)) {
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

  getAvatar(): Promise<string> | string  {
    if (!this.avatar)
      return null;

    else if (this.avatar.includes('avatar-'))
      return 'assets/avatars/' + this.avatar;

    else
      return this.firebaseService.downloadImage('users/' + this.firebaseService.uid + '/clients/' + this.id + '/' + this.avatar);
  }
}
