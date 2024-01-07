import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Report } from '../models/report.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private appKey = 'xIfQhdOq6Z';
  private apiUrl = `https://272.selfip.net/apps/${this.appKey}/collections/`;
  reportFormSubmitted = new Subject<void>();

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) { }


  createReportCollection(): Observable<any> {
    // Check if the collection exists
    return this.http.get(this.apiUrl+`data1/`, this.httpOptions)
      .pipe(
        catchError(error => {
          if (error.status === 404) {
            // Create the collection if it doesn't exist
            return this.http.post(this.apiUrl, { key: 'data1', readers: null, writers: null }, this.httpOptions);
          } else {
            return throwError(error);
          }
        })
      );
  }

  // createReport(report: Report): Observable<any> {
  //   // return this.http.post(this.apiUrl+'data1/documents/', { key: report.id, data: report }, this.httpOptions);
  //   return this.http.post('https://272.selfip.net/apps/njwmRoiy1g/collections/data7/documents/', {"key": "user", "data": "{'name': 'bobby', 'age': '20'}"}).subscribe((data:any)=>{console.log(data);
  // }


  createReport(report: Report): Observable<any> {
    // Works
    report.id = uuidv4();
    console.log(report.id)
    // Key must be unique for it to submit
    return this.http.post('https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/', { "key": report.id, "data": report });
  }

  // getReport(id: string): Observable<Report> {
  //   return this.http.get<Report>(`${this.apiUrl+'data1/documents/'}${id}/`, this.httpOptions);
  // }

  // updateReport(report: Report): Observable<any> {
  //   return this.http.put(`${this.apiUrl+'data1/documents/jaredt/'}${report.id}/`, { key: report.id, data: report }, this.httpOptions);
  // }

  deleteReport(report: Report): Observable<any> {
    // Works
    // console.log(report.id);
    return this.http.delete(`${this.apiUrl+'data1/documents/'}${report.id}/`, this.httpOptions);
  }


  async pull(): Promise<Report[]> {
    return firstValueFrom(this.http.get<Report[]>(this.apiUrl+'data1/documents/')
      .pipe(
        map((response: any) => {
          // Extracts the report data from the response
          return response.map((item: any) => item.data);
        })
      ));
  }


  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl+'data1/documents/', this.httpOptions)
      .pipe(
        map((response: any) => {
          // Extracts the report data from the response
          return response.map((item: any) => item.data);
        }),
        catchError(this.handleError) // Add this line for error handling
      );
  }


  // Error handling
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



/*
My created username: jaredt
My created password: jaredt

Your application key: xIfQhdOq6Z
Your secret key: XGMU5lYIHRJcJw36UKgNZFhEk7lWlS
Your application URL (dashboard): https://272.selfip.net/accounts/xIfQhdOq6Z/manage/XGMU5lYIHRJcJw36UKgNZFhEk7lWlS/

Here are some useful commands that I will demo in class later this week.

Create a collection "data1":
Method: POST
Body: {"key":"data1", "readers":null, "writers":null} 
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/

Delete a collection:
Method: DELETE
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/

Create a document "username" in collection "data1":
Method: POST
Body: {"key":"username", "data": "bobby"} 
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/

Create a document with a more complex data set:
Method:  POST
Body: {"key":"values", "data": "[1,2,3,4]"}
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/

Update a document:
Method: PUT
Body: {"key":"username", "data": "bobbyc"}
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/username/

Retrieve a document:
Method: GET
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/username/

Delete a document:
Method: DELETE
URL: https://272.selfip.net/apps/xIfQhdOq6Z/collections/data1/documents/username/

*/