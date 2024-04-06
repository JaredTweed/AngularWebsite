import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from '../../models/report.model';
import { defaultEquals } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  // @Output() coordinates = new EventEmitter<Report>();

  dataTheme = localStorage.getItem('theme') || 'light';
  reports: Report[] = [];
  sortColumn: number = 0;
  sortDirection: string = 'asc';

  constructor(private reportService: ReportService) {
    this.reports = [];
  }

  ngOnInit(): void {
    this.loadReports();
  }

  updateTheme(): void {
    this.dataTheme = localStorage.getItem('theme') || 'light';
  }

  reloadPage(): void { location.reload(); }

  loadReports(): void {
    this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        this.reports = reports;
        // reports.forEach(report => console.log('Report ID:', report, report.timeDate));
        // reports.forEach(report => this.coordinates.emit(report));
      },
      (error: any) => {
        console.error('Error occurred while loading reports:', error);
        // Handle the error here (e.g., show an error message)
      }
    );

    // this.reportService.pull().then(
    //   (reports: Report[]) => {
    //     this.reports = reports;
    //     reports.forEach(report => console.log('Report ID:', report.location));
    //   },
    //   (error: any) => {
    //     console.error('Error occurred while loading reports:', error);
    //     // Handle the error here (e.g., show an error message)
    //   }
    // );
  }

  deleteReport(report: Report): void {
    console.log(report);
    this.reportService.deleteReport(report).subscribe((response: any) => {
      this.loadReports();
    });
  }

  sortReports(column: number): void {
    console.log(this.dataTheme)

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort the list of reports array based on the selected column and direction
    switch (this.sortColumn) {
      case 1:
        // Sort based on report.reporterInfo.name
        this.reports.sort((a, b) => {
          const nameA = a.reporterInfo.name.toUpperCase();
          const nameB = b.reporterInfo.name.toUpperCase();
          if (nameA < nameB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (nameA > nameB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      case 2:
        // Sort based on report.troublemakerName
        this.reports.sort((a, b) => {
          const nameA = a.troublemakerName.toUpperCase();
          const nameB = b.troublemakerName.toUpperCase();
          if (nameA < nameB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (nameA > nameB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      case 3:
        // Sort based on report.location.name
        this.reports.sort((a, b) => {
          const nameA = a.location.name.toUpperCase();
          const nameB = b.location.name.toUpperCase();
          if (nameA < nameB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (nameA > nameB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      case 4:
        // Sort based on report.timeDate
        this.reports.sort((a, b) => {
          const dateA = a.timeDate;
          const dateB = b.timeDate;
          if (dateA < dateB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (dateA > dateB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      default:
        // Handle invalid column
        break;
    }
  }

  viewDetails(report: Report): void {
    // Show the component
    // console.log('Viewing details for report:', report);
    // <app-report-details [report]="report"></app-report-details>
  }


}

