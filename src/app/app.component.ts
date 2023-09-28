import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, of, concat } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  tap,
  catchError,
  filter,
  map,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  photos: any[] = [];
  photosBuffer: any[] = [];
  bufferSize = 50;
  loading = false;
  input$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/photos')
      .subscribe((photos) => {
        this.photos = photos;
      });

    this.onSearch();
  }

  fetchMore(term: any) {
    const len = this.photosBuffer.length;
    const more = this.photos
      .filter((x) => x.title.includes(term))
      .slice(len, this.bufferSize + len);
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.photosBuffer = this.photosBuffer.concat(more);
    }, 200);
  }

  onSearch() {
    this.input$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => this.fakeService(term))
      )
      .subscribe((data) => {
        this.photosBuffer = data.slice(0, this.bufferSize);
      });
  }

  private fakeService(term: any) {
    return this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/photos')
      .pipe(
        map((data) =>
          data.filter((x: { title: string }) => x.title.includes(term))
        )
      );
  }
}
