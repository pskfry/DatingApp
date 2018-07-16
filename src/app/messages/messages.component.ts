import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { AuthService } from '../_services/auth.service';
import { PageChangedEvent } from '../../../node_modules/ngx-bootstrap';
import * as _ from 'underscore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'unread';
  defaultPhoto = '../../assets/user.png';

  constructor(private userService: UserService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(
      this.authService.decodedToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.messageContainer)
        .subscribe((res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        }, error => {
          this.alertifyService.error(error);
        });
  }

  deleteMessage(id: number) {
    this.alertifyService.confirm('Are you sure you want to delete this message?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(
        () => {
          this.messages.splice(_.findIndex(this.messages, {id: id}), 1);
          this.alertifyService.success('Message has been deleted');
        }, error => {
          this.alertifyService.error('Failed to delete message');
        }
      );
    });
  }

  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
