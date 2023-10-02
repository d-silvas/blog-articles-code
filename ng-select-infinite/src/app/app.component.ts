import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <app-select-wrap>
    <ng-select bindValue="thumbnailUrl" placeholder="Select photo" #select>
      <ng-template ng-label-tmp let-item="item">
        {{ item.title }}
      </ng-template>
      <ng-template
        ng-option-tmp
        let-item="item"
        let-index="index"
        let-search="searchTerm"
      >
        <b>{{ index }} </b>
        <span [ngOptionHighlight]="search">{{ item.title }}</span>
        <br />
      </ng-template>
      <ng-template ng-header-tmp>
        <app-select-wrap-filtered-by></app-select-wrap-filtered-by>
      </ng-template>
      <ng-template ng-loadingtext-tmp> Loading ... </ng-template>
      <ng-template ng-typetosearch-tmp>Type to search somethin</ng-template>
    </ng-select>
  </app-select-wrap>`,
})
export class AppComponent implements OnInit {
  filteredBy: string | null = null;
  constructor() {}

  ngOnInit() {}
}
