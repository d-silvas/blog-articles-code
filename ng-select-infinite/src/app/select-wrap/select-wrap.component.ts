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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-wrap',
  template: ` <ng-content></ng-content> `,
  providers: [DataService],
})
export class SelectWrapComponent implements AfterContentInit {
  @ContentChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;
  // TODO: Maybe we can grab the template directly and modify its contents instead of this output
  //   @Output() filteredBy = new EventEmitter<string | null>();

  // TODO: implement load on 1st opening
  // TODO: button to clear filters

  constructor(
    private readonly dataService: DataService,
    private readonly _cdr: ChangeDetectorRef
  ) {
    console.log('Service number', this.dataService.num);
  }

  ngAfterContentInit(): void {
    if (!this.ngSelectComponent) {
      throw new Error('NgSelectComponent not found');
    }

    this.ngSelectComponent.scrollToEnd.subscribe(() => {
      console.log('Scrolled TO END');
      this.dataService.fetchMore();
    });
    // this.ngSelectComponent.focusEvent.subscribe(() => {
    //   console.log('FOCUS');
    // });
    // TODO need to detect the first time this is opened. Maybe this can be configurable
    // via an @Input
    this.ngSelectComponent.openEvent.subscribe(() => {
      console.log('OPEN');
    });
    this.ngSelectComponent.typeahead = this.dataService.typeahead$;
    this.dataService.isLoadItemsInProgress$.subscribe((i) => {
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

    // TODO TEMPORARY, change !!!
    // this.dataService.searchTerm$.subscribe((t) => {
    //   this.filteredBy.emit(t);
    // });
  }
}
