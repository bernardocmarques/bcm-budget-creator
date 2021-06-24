import {Component, EventEmitter, Input, OnInit} from '@angular/core';

import {FirebaseAuthService} from "../../../_services/firebase-auth.service";
import {AlertService} from "../../../_services/alert.service";
import {ThemeService} from "../../../_services/theme.service";
import {CacheService} from "../../../_services/cache.service";
import {User} from "../../../_domain/user";
import {NgForm} from "@angular/forms";
import {FirebaseService} from "../../../_services/firebase.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {

  @Input() save: EventEmitter<void>;
  @Input() form: NgForm;

  user: User;
  loading: boolean;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private alertService: AlertService,
    public themeService: ThemeService,
    private cacheService: CacheService,
    private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.cacheService.getUserInfo().then(obs => obs.subscribe(user => {
      this.user = user;
      this.updateAvatarThemeIfDefault();
      this.loading = false;
    }));
    this.save.subscribe(v => this.onSubmit())
  }

  async onSubmit(): Promise<void> {
    if (this.form.form.valid) {
      this.firebaseService.setUserInfo(this.user).then(res => res);
      this.cacheService.setUserInfo(this.user);
      this.alertService.showAlert('Changes saved', 'Changes successful saved.', 'success');

    } else {
      this.alertService.showAlert('Error', 'Invalid form. Please fix the errors and submit again.', 'danger');
    }
  }

  updateAvatarThemeIfDefault(): void {
    if (this.user.avatar.includes('default'))
      this.user.avatar = this.themeService.isDark() ? 'assets/avatars/default-dark.svg' : 'assets/avatars/default.svg';
  }

}
