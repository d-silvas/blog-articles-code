import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SelectWrapComponent } from './select-wrap/select-wrap.component';
import { SelectWrapFilteredByComponent } from './select-wrap/select-wrap-filtered-by.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    SelectWrapComponent,
    SelectWrapFilteredByComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
