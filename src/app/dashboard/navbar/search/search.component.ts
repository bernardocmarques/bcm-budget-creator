import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  search: string;

  constructor() { }

  ngOnInit(): void {
  }

  doSearch(): void {
    // TODO
    console.log(this.search);
  }

}
