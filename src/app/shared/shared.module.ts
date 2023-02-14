import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    GooglePlaceModule,
  ],
  exports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    GooglePlaceModule,
  ],
})
export class SharedModule {}
