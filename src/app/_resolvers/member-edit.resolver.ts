import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError((error) => {
                this.alertifyService.error(error);
                this.router.navigate(['/members']);

                return Observable.throw(error);
            })
        );
    }

    constructor(private alertifyService: AlertifyService,
        private router: Router,
        private authService: AuthService,
        private userService: UserService ) {
    }
}
