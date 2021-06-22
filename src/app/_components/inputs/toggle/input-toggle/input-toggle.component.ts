import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {ThemeService} from "../../../../_services/theme.service";

@Component({
  selector: 'app-input-toggle',
  templateUrl: './input-toggle.component.html',
  styles: [
  ]
})
export class InputToggleComponent implements OnInit {

  // Essentials
  @Input() id: string;                            // Unique id
  @Input() form: NgForm;                          // Form it's part of
  @Input() value: boolean;                        // Where to store the value
  @Input() labelLeft: string;                     // Left label
  @Input() labelRight: string;                    // Right label

  // Extras
  @Input() classList?: string;                    // Classes to add

  @Output() valueChange = new EventEmitter<boolean>();

  @ViewChild('inputToggle', { static: false }) inputToggle: NgModel;

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.form) this.form.addControl(this.inputToggle);
  }

}
