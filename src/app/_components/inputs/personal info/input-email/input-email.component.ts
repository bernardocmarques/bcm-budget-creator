import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
})
export class InputEmailComponent implements OnInit, AfterViewInit {

  // Essentials
  @Input() id: string;                                                // Unique id
  @Input() form: NgForm;                                              // Form it's part of
  @Input() value: string;                                             // Where to store the value
  @Input() placeholder: string;                                       // Message to show by default

  // Extras
  @Input() label?: string;                                            // Label prepend
  @Input() btnText?: string;                                          // Text on appended button
  @Input() classList?: string;                                        // Classes to add
  @Input() disabled?: boolean;                                        // Make it disabled

  // Validity
  @Input() pattern? = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';      // The pattern to be applied
  @Input() required?: boolean;                                        // Make it required
  @Input() minLength?: number;                                        // Enforce a minimum length
  @Input() maxLength?: number;                                        // Enforce a maximum length

  // Errors
  @Input() patternErrorMessage?: string = "Invalid e-mail format";    // Message for pattern error
  @Input() requiredErrorMessage?: string;                             // Message for required error
  @Input() minLengthErrorMessage?: string;                            // Message for minLength error
  @Input() maxLengthErrorMessage?: string;                            // Message for maxLength error
  @Input() incorrectErrorMessage?: string;                            // Message for incorrect error

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputEmail', { static: false }) inputEmail: NgModel;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.form.addControl(this.inputEmail);
  }

}
