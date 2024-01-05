import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDetailsComponent } from './components/report-details/report-details.component';

const routes: Routes = [
  { path: 'details/:id', component: ReportDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
