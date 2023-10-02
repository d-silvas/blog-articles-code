import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  debounce,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';

@Injectable()
export class DataService {
  size = 20;
  // TODO maybe BehaviorSubject, but maybe NOT, because we don't want to fetch
  // API results just when this component is initialized. At least, we want to wait for the
  // user to open the dropdown for the first time
  // UPDATE we are fetching data on initialization now
  search$ = new BehaviorSubject<{
    searchTerm: string | null;
    useDebounceTime: boolean;
    fetchRecords: boolean;
  }>({
    searchTerm: null,
    useDebounceTime: false,
    fetchRecords: true,
  });
  items$ = new BehaviorSubject<any[]>([]);
  page = 0;
  // TODO see if this can be extracted from search$
  searchTerm$ = new BehaviorSubject<string | null>(null);
  isLoadItemsInProgress$ = new BehaviorSubject<boolean>(false);

  private get items(): any[] {
    return this.items$.getValue();
  }
  private get searchTerm(): string | null {
    return this.searchTerm$.getValue();
  }

  constructor(private readonly http: HttpClient) {
    this.search$
      .pipe(
        tap((term) => console.log('typeahead$ started ->', term)),
        filter(({ fetchRecords }) => !!fetchRecords),
        debounce(({ useDebounceTime }) =>
          useDebounceTime ? timer(400) : of(null)
        ),
        // Guarantees "term" is always different than previous
        distinctUntilChanged(),
        // Now we control when we emit null. We want to fetch results when WE emit null
        // filter((term) => !!term),
        switchMap(({ searchTerm }) => this.fakeService(searchTerm))
      )
      .subscribe({
        next: ({ term, data }) => {
          console.log('typeahead$ completed');
          this.searchTerm$.next(term);
          this.page = 0;
          this.items$.next([...data]);
        },
        // I believe this should never happen if we catch the errors inside fakeService
        error: (err) => {
          console.error('ERROR in typeahead$', err);
        },
        complete: () => {
          console.log('!!!!!!!! COMPLETE !!!!!!!!');
        },
      });
  }

  fetchMore() {
    // TODO this could cause search$ to emit maybe, and that'd be easier to manage
    this.page += 1;
    this.fakeService(this.searchTerm).subscribe(({ term, data }) => {
      console.log('fetched', data.length);
      this.items$.next([...this.items, ...data]);
    });
  }

  private fakeService(term: any): Observable<{ term: string; data: any[] }> {
    console.log('FETCHIN', term);
    this.isLoadItemsInProgress$.next(true);
    // TODO NOT FETCH IF ALREADY AT END OF RESULTS <-- Can't do in this demo (needs count)
    const nextBatchStartIndex = this.page * this.size;
    const nextBatchEndIndex = nextBatchStartIndex + this.size;
    return this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/photos')
      .pipe(
        delay(2000),
        map((data) => {
          console.log('GOT DATA');
          console.log(this.page, this.size);
          console.log(data.length);
          // TODO this may be outside of this function, in the search$ pipe, if we always used that pipe
          this.isLoadItemsInProgress$.next(false);
          return {
            term,
            data: data
              .filter((x: { title: string }) => x.title.includes(term))
              .slice(nextBatchStartIndex, nextBatchEndIndex),
          };
        }),
        catchError((err) => {
          this.isLoadItemsInProgress$.next(false);
          console.error('ERROR in service', err);
          return of({ term, data: [] });
        })
      );
  }
}
