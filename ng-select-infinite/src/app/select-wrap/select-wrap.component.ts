import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  OnInit,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataService } from '../data.service';

@Component({
  selector: 'app-select-wrap',
  template: ` <ng-content></ng-content> `,
})
export class SelectWrapComponent implements AfterContentInit {
  @ContentChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;

  constructor(
    private readonly dataService: DataService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

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
    this.ngSelectComponent.openEvent.subscribe(() => {
      console.log('OPEN');
    });
    this.ngSelectComponent.typeahead = this.dataService.typeahead$;
    this.dataService.init();
    this.dataService.items$.subscribe((i) => {
      console.log('set items', i);
      // TODO investigate if this is legit
      this.ngSelectComponent.ngOnChanges({ items: { currentValue: i } as any });
      this.ngSelectComponent.detectChanges();
    });
  }
}
