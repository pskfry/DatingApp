import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/Message';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';
import { tap } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() userId: number;
  messages: Message[];
  newMessage: any = {};
  defaultPhoto = '../../../assets/user.png';

  constructor(private userService: UserService,
    private alertifyService: AlertifyService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;

    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.userId)
      .pipe(
        tap(messages => {
          _.each(messages, (message: Message) => {
            if (message.isRead === false && message.recipientId === currentUserId) {
              this.userService.markMessageAsRead(currentUserId, message.id);
            }
          });
        })).subscribe(messages => {
          this.messages = messages;
        }, error => {
          this.alertifyService.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.userId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe(
      message => {
        this.newMessage.content = '';
        this.messages.unshift(message);
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }

}
