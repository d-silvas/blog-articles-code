import { Component } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectWrapComponent } from './select-wrap.component';

@Component({
  selector: 'app-select-wrap-filtered-by',
  template: `
    <input
      type="text"
      placeholder="Filter here"
      [ngModel]="filteredBy$ | async"
      (ngModelChange)="onSearchTermChanged($event)"
      [disabled]="(loading$ | async) === true"
      style="width:80%;"
    />
    <a
      *ngIf="(filteredBy$ | async) !== null && (loading$ | async) !== true"
      style="cursor:pointer;color:red;font-weight:bold;"
      (click)="clearFilter()"
      >X</a
    >
  `,
  styles: [':host { display: contents; }'],
})
export class SelectWrapFilteredByComponent {
  filteredBy$: Observable<string | null>;
  loading$: Observable<boolean>;

  // TODO this component should handle the loading status. We can grey out the whole component
  // and disable the (future) button and/or replace it by a loading icon

  constructor(
    private readonly dataService: DataService,
    private readonly selectWrapComponent: SelectWrapComponent
  ) {
    this.filteredBy$ = this.dataService.searchTerm$;
    this.filteredBy$.subscribe((f) =>
      console.log('__--^^ FILTERED BY ^^--__', f)
    );
    this.loading$ = this.dataService.isLoadItemsInProgress$;
  }

  onSearchTermChanged(newSearchTerm: string) {
    this.dataService.search$.next({
      searchTerm: newSearchTerm,
      useDebounceTime: true,
      fetchRecords: true,
    });
  }

  clearFilter() {
    // TODO this has a delay because of debounceTime. It would be nice to not
    // have this delay. I guess typeahead$ should be an object { term: string, useDebounceTime: boolean }
    this.dataService.search$.next({
      searchTerm: null,
      useDebounceTime: false,
      fetchRecords: true,
    });
  }
}
