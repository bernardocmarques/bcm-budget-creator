import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {User} from '../../../_domain/user';
import {FirebaseAuthService} from "../../../_services/firebase-auth.service";
import {ThemeService} from "../../../_services/theme.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  animations: [
    trigger('appear', [
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      state('opened', style({
        opacity: 1,
        display: 'block'
      })),
      transition('closed<=>opened', animate('150ms ease-in-out'))
    ])
  ]
})
export class ProfileComponent implements OnInit {

  @ViewChild('toggleBtn') toggleBtn: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  isProfileMenuOpen = false;
  user: User;

  constructor(
    private renderer: Renderer2,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
    private themeService: ThemeService
  ) {

    this.renderer.listen('window', 'click', (e: Event) => {
      const toggleBtn = this.toggleBtn.nativeElement;
      const toggleBtnChildren = toggleBtn.querySelectorAll('*');
      const menu = this.menu.nativeElement;

      if (e.target !== toggleBtn && e.target !== menu) {
        let clicked = false;
        for (const child of toggleBtnChildren)
          if (e.target === child) clicked = true;
        if (!clicked) this.isProfileMenuOpen = false;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // this.user = await this.getUser();
  }

  // async getUser(): Promise<User> {
  //   return this.firebaseService.getDatabaseData('users/' + this.firebaseAuthService.currentUser.uid);
  // }

  getAvatar(): string {
    if (this.user && this.user.avatar) return this.user.avatar;
    else if (this.themeService.isDark()) return 'assets/avatars/default-dark.svg'
    return 'assets/avatars/default.svg';
  }

  async logout(): Promise<void> {
    await this.firebaseAuthService.logout();
  }

}
