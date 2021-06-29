import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
})
export class InputNumberComponent implements OnInit, AfterViewInit {

  // Essentials
  @Input() id: string;                            // Unique id
  @Input() form: NgForm;                          // Form it's part of
  @Input() value: number;                         // Where to store the value
  @Input() placeholder: string;                   // Message to show by default

  // Extras
  @Input() label?: string;                        // Label prepend
  @Input() btnText?: string;                      // Text on appended button
  @Input() classList?: string;                    // Classes to add
  @Input() disabled?: boolean;                    // Make it disabled

  // Validity
  @Input() required?: boolean;                    // Make it required
  @Input() minValue?: number;                     // Enforce a minimum value
  @Input() maxValue?: number;                     // Enforce a maximum value

  // Errors
  @Input() requiredErrorMessage?: string;         // Message for required error
  @Input() minValueErrorMessage?: string;         // Message for minLength error
  @Input() maxValueErrorMessage?: string;         // Message for maxLength error

  @Output() valueChange = new EventEmitter<number>();
  @Output() btnClicked = new EventEmitter<void>();

  @ViewChild('inputNumber', { static: false }) inputNumber: NgModel;

  constructor() {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.form) this.form.addControl(this.inputNumber);
  }

}
