import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageSize = 5;
    pageNumber = 1;

    constructor(private alertifyService: AlertifyService, private router: Router, private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError((error) => {
                this.alertifyService.error(error);
                this.router.navigate(['/']);

                return of(null);
            })
        );
    }
}
