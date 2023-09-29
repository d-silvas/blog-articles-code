import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
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
  term = '';

  private get items(): any[] {
    return this.items$.getValue();
  }

  constructor(private readonly http: HttpClient) {}

  // ngOnInit() {
  //   this.http
  //     .get<any[]>('https://jsonplaceholder.typicode.com/photos')
  //     .subscribe((photos) => {
  //       this.photos = photos;
  //     });

  //   this.onSearch();
  // }

  init() {
    this.typeahead$
      .pipe(
        tap((term) => console.log('typeahead$ started ->', term)),
        debounceTime(400),
        // Guarantees "term" is always different than previous
        distinctUntilChanged(),
        // TODO add pagination in fakeService
        switchMap((term) => this.fakeService(term))
      )
      .subscribe(({ term, data }) => {
        console.log('typeahead$ completed');
        this.term = term;
        this.page = 0;
        this.items$.next([...data]);
      });
  }

  fetchMore() {
    this.page += 1;
    this.fakeService(this.term).subscribe(({ term, data }) => {
      console.log('fetched', data.length);
      this.items$.next([...this.items, ...data]);
    });
  }

  private fakeService(term: any) {
    console.log('FETCHIN');
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
        })
      );
  }
}
