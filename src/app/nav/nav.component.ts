import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alertifyService: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.authService.userMainPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
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
    localStorage.remoteItem('mainPhoto');
    this.router.navigate(['/home']);
    this.alertifyService.success('Logged out!');
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
