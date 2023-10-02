import { Component } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { SelectWrapComponent } from './select-wrap.component';

@Component({
  selector: 'app-select-wrap-filtered-by',
  template: `
    <span *ngIf="(filteredBy$ | async) !== null">
      Filtered by {{ filteredBy$ | async }} &nbsp;
      <a (click)="clearFilter()">X</a>
    </span>
    <span *ngIf="(filteredBy$ | async) === null"> No filter applied </span>
    <br />
    <input type="text" placeholder="Filtere here heh" />
  `,
  styles: [':host { display: contents; }'],
})
export class SelectWrapFilteredByComponent {
  filteredBy$: Observable<string | null>;

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
  }

  clearFilter() {
    this.dataService.typeahead$.next(null as any);
    this.selectWrapComponent.clearFilter();
  }
}
