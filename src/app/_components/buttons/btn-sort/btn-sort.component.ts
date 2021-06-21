import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-btn-sort',
  templateUrl: './btn-sort.component.html',
  styles: [
  ]
})
export class BtnSortComponent implements OnInit {

  @Input() sort: number;

  @Output() btnClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  changeSort(): void {
    if (!this.sort) this.sort = 1;
    else this.sort = -1 * this.sort;
    console.log(this.sort)
    this.btnClicked.emit(this.sort);
  }

}
