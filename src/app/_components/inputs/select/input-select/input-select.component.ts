import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html'
})
export class InputSelectComponent<T> implements OnInit, AfterViewInit {

  // Essentials
  @Input() id: string;                                    // Unique id
  @Input() form?: NgForm;                                 // Form it's part of
  @Input() value: T;                                      // Where to store the value
  @Input() options?: T[];                                 // Options to be selected
  @Input() optionsObj?: {value: T, text: string}[];       // Options to be selected

  // Extras
  @Input() label?: string;                                // Label prepend
  @Input() classList?: string;                            // Classes to add
  @Input() disabled?: boolean;                            // Make it disabled

  @Input() customCompare?: (t1: T, t2: T) => boolean = this.compareFn; //function to compare values

  // Validity
  @Input() required?: boolean;                            // Make it required

  // Errors
  @Input() requiredErrorMessage?: string;                 // Message for required error

  @Output() valueChange = new EventEmitter<T>();

  @ViewChild('select', { static: false }) select: NgModel;

  compareFn(t1: T, t2: T): boolean {
    return t1 && t2 ? t1.valueOf() == t2.valueOf() : t1 === t2;
  }

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.form) this.form.addControl(this.select);
  }

  reset() {
    this.select.reset();
  }

}
