import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

let i = 0;

@Injectable()
export class DataService {
  photos: any[] = [];
  photosBuffer: any[] = [];
  bufferSize = 50;
  size = 20;
  loading = false;
  // TODO maybe BehaviorSubject, but maybe NOT, because we don't want to fetch
  // API results just when this component is initialized. At least, we want to wait for the
  // user to open the dropdown for the first time
  typeahead$ = new Subject<string>();
  items$ = new BehaviorSubject<any[]>([]);
  page = 0;
  searchTerm$ = new BehaviorSubject<string | null>(null);
  isLoadItemsInProgress$ = new BehaviorSubject<boolean>(false);

  private get items(): any[] {
    return this.items$.getValue();
  }
  private get searchTerm(): string | null {
    return this.searchTerm$.getValue();
  }
  num: number;

  constructor(private readonly http: HttpClient) {
    this.num = i;
    i += 1;
  }

  init() {
    this.typeahead$
      .pipe(
        tap((term) => console.log('typeahead$ started ->', term)),
        debounceTime(400),
        // Guarantees "term" is always different than previous
        distinctUntilChanged(),
        // Ng-select emits a null value when we close the dropdown after having searched.
        // This can be because one item was selected, or simply because the user clicked outside
        filter((term) => !!term),
        switchMap((term) => this.fakeService(term))
      )
      .subscribe({
        next: ({ term, data }) => {
          this.isLoadItemsInProgress$.next(false);
          console.log('typeahead$ completed');
          this.searchTerm$.next(term);
          this.page = 0;
          this.items$.next([...data]);
        },
        error: (err) => {
          console.error('ERROR in typeahead$', err);
        },
        complete: () => console.log('!!!!!!!! COMPLETE !!!!!!!!'),
      });
  }

  fetchMore() {
    this.page += 1;
    this.fakeService(this.searchTerm).subscribe(({ term, data }) => {
      console.log('fetched', data.length);
      this.items$.next([...this.items, ...data]);
    });
  }

  private fakeService(term: any): Observable<{ term: string; data: any[] }> {
    console.log('FETCHIN', term);
    this.isLoadItemsInProgress$.next(true);
    // TODO NOT FETCH IF ALREADY AT END OF RESULTS
    return this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/photos')
      .pipe(
        delay(2000),
        map((data) => {
          console.log('GOT DATA');
          console.log(this.page, this.size);
          console.log(data.length);
          //   console.log({
          //     term,
          //     data: data
          //       .filter((x: { title: string }) => x.title.includes(term))
          //       .slice(this.page * this.size, this.page * this.size + this.size),
          //   });
          return {
            term,
            data: data
              .filter((x: { title: string }) => x.title.includes(term))
              .slice(this.page * this.size, this.page * this.size + this.size),
          };
        }),
        catchError((err) => {
          console.error('ERROR in service', err);
          return of({ term, data: [] });
        }),
        tap(() => this.isLoadItemsInProgress$.next(false))
      );
  }
}