import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../_models/User';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Photo } from '../_models/Photo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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

  deletePhoto(photoId: number, userId: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId).pipe(
      catchError(error => this.handleError(error))
    );
  }

  setMainPhoto(userId: number, photo: Photo) {
    localStorage.setItem('mainPhoto', photo.url);

    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photo.id + '/setMain', photo).pipe(
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
