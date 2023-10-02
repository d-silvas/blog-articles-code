import { Component } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-wrap-filtered-by',
  template: `
    <span *ngIf="(filteredBy$ | async) !== null">
      Filtered by {{ filteredBy$ | async }}
    </span>
    <span *ngIf="(filteredBy$ | async) === null"> No filter applied </span>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectWrapFilteredByComponent {
  filteredBy$: Observable<string | null>;

  constructor(private readonly dataService: DataService) {
    console.log('Service number', this.dataService.num);
    this.filteredBy$ = this.dataService.searchTerm$;
    this.filteredBy$.subscribe((f) =>
      console.log('__--^^ FILTERED BY ^^--__', f)
    );
  }
}
