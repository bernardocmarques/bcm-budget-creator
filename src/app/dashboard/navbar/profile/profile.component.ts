import {Component, ElementRef, Injector, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {FirebaseAuthService} from "../../../_services/firebase-auth.service";
import {ThemeService} from "../../../_services/theme.service";
import firebase from "firebase";
import {CacheService} from "../../../_services/cache.service";

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
  avatar: string;

  constructor(
    private renderer: Renderer2,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
    private themeService: ThemeService,
    private cacheService: CacheService
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

    this.avatar = themeService.isDark() ? 'assets/avatars/default-dark.svg' : 'assets/avatars/default.svg';
  }

  async ngOnInit(): Promise<void> {
    this.getAvatar();
  }

  getAvatar(): void {
    this.cacheService.getUserInfo().then(obs => obs.subscribe(user => {
      if (user.avatar.includes('default'))
        this.avatar = this.themeService.isDark() ? 'assets/avatars/default-dark.svg' : 'assets/avatars/default.svg';
      else this.avatar = user.avatar;
    }));
  }

  async logout(): Promise<void> {
    await this.firebaseAuthService.logout();
  }

}
