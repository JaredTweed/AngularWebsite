import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import { CommonModule } from '@angular/common';
import { LocationFormComponent } from './components/location-form/location-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    DataTableComponent,
    ReportFormComponent,
    ReportDetailsComponent,
    LocationFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
