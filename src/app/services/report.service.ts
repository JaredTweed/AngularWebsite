import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Report } from '../models/report.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportsKey = 'reports';
  reportFormSubmitted = new Subject<void>();

  constructor() {
    // Check if localStorage has zero reports and add a few
    if (this.getAllReportsFromStorage().length === 0) {
      const initialReports: Report[] = [
        {
          id: "b9483a08-6688-4d0d-bc98-3354e7226278",
          reporterInfo: {
            name: 'Jared Tweed',
            phoneNumber: '(778) - 979 - 0126'
          },
          troublemakerName: 'Anton Chigurh',
          location: {
            name: 'Simon Fraser University',
            longitude: -122.9168,
            latitude: 49.2789
          },
          pictureUrl: '',
          extraInfo: '',
          timeDate: new Date(),
          status: 'OPEN'
        },
        {
          id: "caf0f192-af4c-4aba-a51f-6d5d5967ded3",
          reporterInfo: {
            name: 'Phil Swift',
            phoneNumber: '(833) - 411 - 3539'
          },
          troublemakerName: 'Darth Vader',
          location: {
            name: 'Tsawwassen Ferry Terminal',
            longitude: -123.1275,
            latitude: 49.0092
          },
          pictureUrl: 'https://static.wikia.nocookie.net/baldi-fanon/images/b/b6/IMG_1094.png',
          extraInfo: '',
          timeDate: new Date(),
          status: 'OPEN'
        },
        {
          id: "1d9f2932-e5a4-43e7-8287-087575184df8",
          reporterInfo: {
            name: 'Vince Offer',
            phoneNumber: '(877) - 376 - 6016'
          },
          troublemakerName: 'Tiffany',
          location: {
            name: 'Simon Fraser University',
            longitude: -122.9168,
            latitude: 49.2789
          },
          pictureUrl: '',
          extraInfo: 'ShamWow!!!!!',
          timeDate: new Date(),
          status: 'OPEN'
        },
        {
          id: "8c6f3c3d-3e0e-4f8f-8d6e-5e5f0c5f4e5b",
          reporterInfo: {
            name: 'Marty McFly',
            phoneNumber: '(778) - 555 - 1985'
          },
          troublemakerName: 'Marty McFly From 1973',
          location: {
            name: 'Aberdeen Centre',
            longitude: -123.1335,
            latitude: 49.1841
          },
          pictureUrl: 'https://th.bing.com/th/id/OIG2.dTX7Ie72aL0who8hd.Qx',
          // pictureUrl: '../assets/baby-mcfly-chaos.jpeg',
          extraInfo: 'Causing mild chaos while trying to start a flash mob with unsuspecting shoppers.',
          timeDate: new Date(),
          status: 'OPEN'
        }
      ];
      this.saveReportsToStorage(initialReports);
    }
  }

  // Utility method to get all reports from localStorage
  private getAllReportsFromStorage(): Report[] {
    const reportsJson = localStorage.getItem(this.reportsKey);
    return reportsJson ? JSON.parse(reportsJson) : [];
  }

  // Utility method to save reports to localStorage
  private saveReportsToStorage(reports: Report[]): void {
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));
    this.reportFormSubmitted.next(); // Emit an event to notify subscribers that a report has been added
  }

  createReport(report: Report): Observable<any> {
    report.id = uuidv4(); // Ensure the report has a unique ID
    const reports = this.getAllReportsFromStorage();
    reports.push(report);
    this.saveReportsToStorage(reports);
    return of({}); // Simulate an Observable response
  }

  deleteReport(report: Report): Observable<any> {
    let reports = this.getAllReportsFromStorage();
    reports = reports.filter(r => r.id !== report.id);
    this.saveReportsToStorage(reports);
    return of({}); // Simulate an Observable response
  }

  getAllReports(): Observable<Report[]> {
    const reports = this.getAllReportsFromStorage();
    console.log('Reports:', reports);
    return of(reports); // Return reports as an Observable
  }

  // Error handling remains unchanged
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
