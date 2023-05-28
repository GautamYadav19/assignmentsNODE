import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export default class ApiService {
  baseUri: string = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
  getTypeRequest(url: any) {
    return this.http.get(`${this.baseUri}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
  postTypeRequest(url: any, payload: any) {
    return this.http.post(`${this.baseUri}${url}`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code:${error.status}\nMessage:${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
