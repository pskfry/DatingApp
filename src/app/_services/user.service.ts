import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, observable, of } from 'rxjs';
import { User } from '../_models/User';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Photo } from '../_models/Photo';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?: any, likesParam?: string): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'likees') {
      params = params.append('likees', 'true');
    }

    return this.http
      .get<User[]>(this.baseUrl + 'users/users', {observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get(this.baseUrl + 'users/' + id)
      .pipe(map(response => <User>response));
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user)
      .pipe();
  }

  deletePhoto(photoId: number, userId: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId)
      .pipe();
  }

  setMainPhoto(userId: number, photo: Photo) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photo.id + '/setMain', photo)
      .pipe();
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {})
      .pipe();
  }

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: string) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('itemsPerPage', itemsPerPage.toString());
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return paginatedResult;
      })
    );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId, {observe: 'response'})
      .pipe(map(res => res.body));
  }

  sendMessage(id: number, message: Message): Observable<Message> {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message)
      .pipe(map((data: Message) => data));
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
      .pipe();
  }

  markMessageAsRead(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }
}
