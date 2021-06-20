import {AfterViewInit, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {routeAnimations} from './_animations/routerAnimations';

import * as eva from 'eva-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routeAnimations]
})
export class AppComponent implements AfterViewInit {
  title = 'budget-creator-tailwind';

  ngAfterViewInit(): void {
    eva.replace();
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
