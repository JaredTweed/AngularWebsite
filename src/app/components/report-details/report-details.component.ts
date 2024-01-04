// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-report-details',
//   templateUrl: './report-details.component.html',
//   styleUrl: './report-details.component.css'
// })
// export class ReportDetailsComponent {
// }

import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../models/report.model';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.css'
})
export class ReportDetailsComponent {
  @Input() report?: Report;

  constructor() { }

  ngOnInit(): void {}
}
