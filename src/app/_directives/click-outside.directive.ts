import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef: ElementRef) { }

  @Output() clickedOutside: EventEmitter<void> = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  onMouseEnter(targetElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) this.clickedOutside.emit();
  }

}
