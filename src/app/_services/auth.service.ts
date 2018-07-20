import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;
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
    return this.http.post(this.baseUrl + 'auth/login', model, this.requestOptions())
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
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'auth/register', model, this.requestOptions())
      .pipe();
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  private requestOptions() {
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
  }
}
