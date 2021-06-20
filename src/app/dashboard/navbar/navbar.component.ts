import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import * as eva from 'eva-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChild('toggleBtn') toggleBtn: ElementRef;
  @Output() toggleSidebar = new EventEmitter<string | void>();

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (window.innerWidth > 767.99) return;
      const toggleBtn = this.toggleBtn.nativeElement;
      const toggleBtnChildren = toggleBtn.querySelectorAll('*');
      const sidebar = document.getElementById('sidebar');

      if (e.target !== toggleBtn && e.target !== sidebar) {
        let clicked = false;
        for (const child of toggleBtnChildren) {
          if (e.target === child) clicked = true;
        }
        if (!clicked) this.toggleSidebar.emit('close');
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    eva.replace();
  }
}
