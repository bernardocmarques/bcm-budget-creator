import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  animations: [
    trigger('appear', [
      state('closed', style({ opacity: 0 })),
      state('open', style({ opacity: 1 })),
      transition('closed<=>open', animate('150ms ease-in-out'))
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('150ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('150ms ease-in',
          style({ transform: 'translateY(50%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  @Input() isModalOpen: boolean;          // Whether or not the modal is visible
  @Input() id?: string;                   // Modal id
  @Input() title: string;                 // Modal title
  @Input() description: string;           // Modal description
  @Input() closeBtnText?: string;         // Left btn text
  @Input() positiveBtnText: string;       // Right btn text
  @Input() positiveBtnColor: string;      // Right btn color
  @Input() actionInProgress?: boolean;    // Show loader while action in progress

  @Input() templateRef?: TemplateRef<any>;   // Custom template for modal

  @Output() closeBtnClicked: EventEmitter<void> = new EventEmitter();
  @Output() positiveBtnClicked: EventEmitter<void> = new EventEmitter();

  // ignore 1st click outside (the one that triggers the modal)
  ignore = true;

  constructor() { }

  ngOnInit(): void {
  }

  clickedOutside(): void {
    if (this.ignore) this.ignore = false;
    else this.closeBtnClicked.emit();
  }

}
