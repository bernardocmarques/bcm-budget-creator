import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

  @Input() icon?: string;
  @Input() iconSVG?: string;
  @Input() color: string;
  @Input() title: string;
  @Input() subtitle: string;

  svg: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.iconSVG)
      this.svg = this.sanitizer.bypassSecurityTrustHtml(this.iconSVG);
  }

}
