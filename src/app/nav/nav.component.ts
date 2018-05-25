import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenName } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  items: string[] = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  constructor(private authService: AuthService, private alertifyService: AlertifyService,
    private jwtHelper: JwtHelperService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      this.alertifyService.success('Logged in!');
    }, error => {
      this.alertifyService.error(error);
    }, () =>
      this.router.navigate(['/member-lists'])
    );
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.alertifyService.success('Logged out!');
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
