import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../_models/User';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.http
      .get(this.baseUrl + 'users/users')
      .pipe(
        map(response => <User[]>response),
        catchError(error => this.handleError(error))
      );
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get(this.baseUrl + 'users/' + id)
      .pipe(
        map(response => <User>response),
        catchError(error => this.handleError(error))
      );
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user).pipe(
      catchError(error => this.handleError(error))
    );
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
