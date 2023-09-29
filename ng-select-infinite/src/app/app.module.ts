import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SelectWrapComponent } from './select-wrap/select-wrap.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    HttpClientModule,
  ],
  declarations: [AppComponent, SelectWrapComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
