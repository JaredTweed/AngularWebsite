// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class HashService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HashService {
  private hashifyUrl = 'https://api.hashify.net/hash/md5/hex';

  constructor(private http: HttpClient) {}

  // Hashes a password using the Hashify API (BaggyJeans)
  hashPassword(password: string): Observable<string> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.hashifyUrl, { "data": password }, { headers })
      .pipe(
        map(response => response.Digest)
      );
  }
}
