import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() classList: string;   // Classes to add
  @Input() color: string;       // Color
  @Input() size: number;        // Size

  constructor() { }

  ngOnInit(): void {
  }

}
