import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {numberWithCommas} from "../../../_util/number";

import * as eva from 'eva-icons';
import {NgForm} from "@angular/forms";

export enum TableDataType {
  TEXT,
  MONEY,
  AVATAR,
  PILL,
  DATE,
  BUTTON,
  ACTIONS,
  INPUT_NUMBER,
  INPUT_TEXT
}

@Component({
  selector: '[table-data]',
  templateUrl: './table-data.component.html',
})
export class TableDataComponent implements OnInit, AfterViewInit {

  @Input() type: TableDataType;     // Type of table data to render
  @Input() data: any;               // Data to render

  text?: string;                    // Text (either 1 line or 1st line)
  subtitle?: string;                // Subtitle (2nd line)

  money?: number;                   // Money

  avatarSrc?: string;               // Avatar source
  avatarName?: string;              // Avatar name
  avatarText?: string;              // Avatar additional text

  pillText?: string;                // Pill text
  pillColor?: string;               // Pill color

  date?: Date;                      // Date

  input?: {                         // Input
    id: string,
    form: NgForm,
    value: any,
    placeholder: string,
    disabled?: boolean,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    minValue?: number,
    maxValue?: number,
    requiredErrorMessage?: string,
    minLengthErrorMessage?: string,
    maxLengthErrorMessage?: string,
    minValueErrorMessage?: string,
    maxValueErrorMessage?: string,
  };

  buttonText?: string;              // Button text
  buttonIcon?: string;              // Button icon (Eva icons)
  buttonColor?: string;             // Button color

  actions?: string[];               // Actions

  @Output() btnClicked: EventEmitter<void> = new EventEmitter();
  @Output() viewBtnClicked: EventEmitter<void> = new EventEmitter();
  @Output() editBtnClicked: EventEmitter<void> = new EventEmitter();
  @Output() deleteBtnClicked: EventEmitter<void> = new EventEmitter();
  @Output() valueChanged: EventEmitter<number | string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    switch (this.type) {
      case TableDataType.TEXT:
        this.text = this.data;
        break;

      case TableDataType.MONEY:
        this.money = this.data;
        break;

      case TableDataType.DATE:
        this.date = this.data;
        break;

      case TableDataType.PILL:
        this.pillText = this.data.text;
        this.pillColor = this.data.color;
        break;

      case TableDataType.AVATAR:
        this.avatarSrc = this.data.src;
        this.avatarName = this.data.name;
        this.avatarText = this.data.text;
        break;

      case TableDataType.BUTTON:
        this.buttonText = this.data.text;
        this.buttonIcon = this.data.icon;
        this.buttonColor = this.data.color;
        break;

      case TableDataType.ACTIONS:
        this.actions = this.data;
        break;

      case TableDataType.INPUT_NUMBER:
      case TableDataType.INPUT_TEXT:
        this.input = { id: null, form: null, value: null, placeholder: null };
        this.input.id = this.data.id;
        this.input.form = this.data.form;
        this.input.value = this.data.value;
        this.input.placeholder = this.data.placeholder;
        if (this.data.disabled) this.input.disabled = this.data.disabled;
        if (this.data.required) {
          this.input.required = this.data.required;
          this.input.requiredErrorMessage = this.data.requiredErrorMessage;
        }
        if (this.data.minLength) {
          this.input.minLength = this.data.minLength;
          this.input.minLengthErrorMessage = this.data.minLengthErrorMessage;
        }
        if (this.data.maxLength) {
          this.input.maxLength = this.data.maxLength;
          this.input.maxLengthErrorMessage = this.data.maxLengthErrorMessage;
        }
        if (this.data.minValue) {
          this.input.minValue = this.data.minValue;
          this.input.minValueErrorMessage = this.data.minValueErrorMessage;
        }
        if (this.data.maxValue) {
          this.input.maxValue = this.data.maxValue;
          this.input.maxValueErrorMessage = this.data.maxValueErrorMessage;
        }
        break;
    }
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  get tableDataType(): typeof TableDataType {
    return TableDataType;
  }

  formatMoney(value: number): string {
    return numberWithCommas(value);
  }

  showButton(text: string): boolean {
    return text !== 'No status' && text !== 'No action';
  }

}
