import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {numberWithCommas} from "../../../_util/number";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {

  @Input() dataLength: number;    // Data length
  @Input() totalPages: number;    // Total number of pages
  @Input() step: number;          // Max number of rows on each page

  @Output() currentPageChanged: EventEmitter<number> = new EventEmitter();

  currentPage: number = 0;

  LEFT = 4;
  RIGHT = 2;
  LEFT_SMALL = 2;
  RIGHT_SMALL = 2;

  smallPhoneView: boolean;

  constructor() { }

  ngOnInit(): void {
    this.onWindowResize();
  }

  formatNumber(value: number): string {
    return numberWithCommas(value);
  }

  changePage(direction: number): void {
    if (direction < 0 && this.currentPage > 0) this.currentPage--;
    else if (direction > 0 && this.currentPage < this.totalPages - 1) this.currentPage++;
    this.currentPageChanged.emit(this.currentPage);
  }

  changePageTo(i: number): void {
    this.currentPage = i;
    this.currentPageChanged.emit(this.currentPage);
  }

  getNumberOfPagesLeft(): number {
    const maxLeft = this.smallPhoneView ? this.LEFT_SMALL : this.LEFT;
    const maxRight = this.smallPhoneView ? this.RIGHT_SMALL : this.RIGHT;

    if (this.totalPages <= maxLeft) return this.totalPages;
    else if (this.currentPage + 1 >= this.totalPages - maxRight) return 0;
    else if (this.totalPages > maxLeft + maxRight) return maxLeft;
    return this.totalPages;
  }

  getNumberOfPagesRight(): number {
    const maxLeft = this.smallPhoneView ? this.LEFT_SMALL : this.LEFT;
    const maxRight = this.smallPhoneView ? this.RIGHT_SMALL : this.RIGHT;

    if (this.currentPage + 1 >= this.totalPages - maxRight) return maxLeft + maxRight;
    return maxRight;
  }

  hasDivider(): boolean {
    const maxLeft = this.smallPhoneView ? this.LEFT_SMALL : this.LEFT;
    const maxRight = this.smallPhoneView ? this.RIGHT_SMALL : this.RIGHT;

    return this.totalPages > maxLeft + maxRight || this.currentPage + 1 === this.totalPages - maxRight;
  }

  getPageNumber(i: number, side: number): number {
    const maxLeft = this.smallPhoneView ? this.LEFT_SMALL : this.LEFT;
    const maxRight = this.smallPhoneView ? this.RIGHT_SMALL : this.RIGHT;

    if (side < 0) { // left
      if (this.currentPage + 1 > maxLeft && this.currentPage + 1 < this.totalPages - maxRight) { // keep increasing
        const offset = this.currentPage + 1 - maxLeft;
        return i + offset;
      }
      return i;

    } else if (side > 0) { // right
      if (this.currentPage + 1 < this.totalPages - maxRight) { // only maxRight pages showing
        return this.totalPages - (maxRight - i);
      }
      return this.totalPages - (maxLeft + maxRight - i);
    }
    return -1;
  }

  min(x1: number, x2: number): number {
    return Math.min(x1, x2);
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.smallPhoneView = window.innerWidth <= 375; // small phones
  }

}
