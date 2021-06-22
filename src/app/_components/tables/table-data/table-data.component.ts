import {Component, Input, OnInit} from '@angular/core';
import {numberWithCommas} from "../../../_util/number";

export enum TableDataType {
  TEXT,
  MONEY,
  AVATAR_ONLY,
  AVATAR_1LINE,
  AVATAR_2LINES,
  PILL,
  DATE,
  BUTTON,
  ACTIONS
}

@Component({
  selector: '[table-data]',
  templateUrl: './table-data.component.html',
  styles: [
  ]
})
export class TableDataComponent implements OnInit {

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

  buttonText?: string;              // Button text
  buttonIcon?: string;              // Button icon (Eva icons)
  buttonLink?: string;              // Button link
  buttonColor?: string;             // Button color

  actions?: string[];               // Actions

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

      case TableDataType.AVATAR_ONLY:
        this.avatarSrc = this.data.src;
        break;

      case TableDataType.AVATAR_1LINE:
        this.avatarSrc = this.data.src;
        this.avatarName = this.data.name;
        break;

      case TableDataType.AVATAR_2LINES:
        this.avatarSrc = this.data.src;
        this.avatarName = this.data.name;
        this.avatarText = this.data.text;
        break;

      case TableDataType.BUTTON:
        this.buttonText = this.data.text;
        this.buttonIcon = this.data.icon;
        this.buttonLink = this.data.url;
        this.buttonColor = this.data.color;
        break;

      case TableDataType.ACTIONS:
        this.actions = this.data;
        break;
    }
  }

  get tableDataType(): typeof TableDataType {
    return TableDataType;
  }

  formatMoney(value: number): string {
    return numberWithCommas(value);
  }

}