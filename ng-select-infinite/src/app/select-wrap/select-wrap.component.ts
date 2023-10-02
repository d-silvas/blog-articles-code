import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataService } from './data.service';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Component({
  selector: 'app-select-wrap',
  template: ` <ng-content></ng-content> `,
  providers: [DataService],
})
export class SelectWrapComponent implements AfterContentInit {
  @ContentChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;
  private selectedItem$ = new BehaviorSubject<any>(null);

  constructor(
    private readonly dataService: DataService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngAfterContentInit(): void {
    if (!this.ngSelectComponent) {
      throw new Error('NgSelectComponent not found');
    } else if (this.ngSelectComponent.multiple) {
      throw new Error('NgSelect multiple mode not supported');
    }

    this.ngSelectComponent.scrollToEnd.subscribe(() => {
      console.log('Scrolled TO END');
      this.dataService.fetchMore();
    });

    // NOT USED
    // this.ngSelectComponent.focusEvent.subscribe(() => {
    //   console.log('FOCUS');
    // });

    // Detect the first time the dropdown is opened, and load data. Maybe this can be configurable via an @Input
    this.ngSelectComponent.openEvent.pipe(take(1)).subscribe(() => {
      console.log('OPEN');
      this.dataService.fetchMore();
    });

    this.ngSelectComponent.typeahead = this.dataService.typeahead$;

    this.dataService.isLoadItemsInProgress$.subscribe((i) => {
      console.log('loadItems', i);
      // PLEASE NOTE
      // Loading template is shown the first time, when there are no records
      // When there are records and we change the search term, then the loading template is not shown
      // Ideally we should show the loading template when search is changed, but not when we scroll to bottom
      this.ngSelectComponent.loading = i;
      this.ngSelectComponent.detectChanges();
    });

    this.dataService.items$.subscribe((i) => {
      console.log('set items', i);
      // TODO investigate if this is legit
      this.ngSelectComponent.ngOnChanges({ items: { currentValue: i } as any });
      this.ngSelectComponent.detectChanges();
    });

    this.dataService.init();
  }

  clearFilter() {
    console.log('clearFilter !!');
    this.ngSelectComponent.searchTerm = null as any;
    this.ngSelectComponent.detectChanges();
    // TODO here we have to fetch initial records from the service (it is indeed possible)
  }
}
