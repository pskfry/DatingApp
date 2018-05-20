import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;

  constructor(private http: Http) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: Response) => {
          const user = response.json();
          if (user) {
            localStorage.setItem('token', user.value);
            this.userToken = user.value;
          }
        }),
        catchError(this.handleError)
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).pipe(catchError(this.handleError));
  }

  private requestOptions() {
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return throwError(error);
    }

    const serverError = error.json();
    let modelStateErrors = '';

    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return throwError(
      modelStateErrors || 'server error'
    );
  }
}
