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
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../services/report.service'; // Import the ReportService

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.css'
})
export class ReportDetailsComponent {
  // @Input() report?: Report;
  reportId: string = '';
  report: Report | undefined;

  constructor(private route: ActivatedRoute, private reportService: ReportService, private router: Router) { } // Inject the ReportService

  ngOnInit(): void {
    this.reportId = this.route.snapshot.params['id'];
    this.reportService.getAllReports().subscribe((reports: Report[]) => {
      this.report = reports.find(report => report.id === this.reportId);
    });
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
