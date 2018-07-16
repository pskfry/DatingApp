import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageSize = 5;
    pageNumber = 1;
    messageContainer = 'unread';

    constructor(private alertifyService: AlertifyService,
        private router: Router, private userService: UserService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(
            this.authService.decodedToken.nameid,
            this.pageNumber, this.pageSize,
            this.messageContainer).pipe(
                catchError((error) => {
                    this.alertifyService.error(error);
                    this.router.navigate(['/member-list']);

                    return of(null);
                })
        );
    }
}
