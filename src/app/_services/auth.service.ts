import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  userMainPhotoUrl = this.photoUrl.asObservable();
  currentUser: User;

  constructor(private http: Http, private jwtHelper: JwtHelperService) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: Response) => {
          const token = response.json().jwtToken;
          const user = response.json().userForNav;

          if (user && token) {
            localStorage.setItem('token', token.value);
            localStorage.setItem('user', JSON.stringify(user));
            this.decodedToken = this.jwtHelper.decodeToken(token.tokenString);
            this.userToken = token.value;
            this.currentUser = user;

            if (this.currentUser.photoUrl !== null) {
              this.changeMemberPhoto(this.currentUser.photoUrl);
            } else {
              this.changeMemberPhoto('../../assets/user.png');
            }
          }
        }),
        catchError(this.handleError)
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).pipe(catchError(this.handleError));
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
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
