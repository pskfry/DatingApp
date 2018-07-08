import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../_models/Photo';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { environment } from '../../../environments/environment';
import * as _ from 'underscore';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  @Output() newMainPhoto = new EventEmitter<Photo>();

  constructor(private authService: AuthService, private userService: UserService,
    private alertifyService: AlertifyService) {
  }

  ngOnInit() {
    this.initializeUploader();
  }

  deletePhoto(id: number) {
    const deletedId = this.photos.findIndex((value: any) => {
      return value.id === id;
    });

    if (this.photos[deletedId].isMainPhoto) {
      this.alertifyService.error('You cannot delete your main photo!');
      return;
    }

    this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
      this.userService.deletePhoto(id, this.authService.decodedToken.nameid)
        .subscribe(next => {
          this.photos.splice(deletedId, 1);
          this.alertifyService.success('Photo deleted');
        }, error => {
          this.alertifyService.error('Failed to delete photo');
        });
    });
  }

  updateMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo)
      .subscribe(() => {
        this.alertifyService.success('Main photo set!');
        this.currentMain = _.findWhere(this.photos, {isMainPhoto: true});
        this.currentMain.isMainPhoto = false;
        photo.isMainPhoto = true;
        this.authService.changeMemberPhoto(photo.url);

        const user = JSON.parse(localStorage.getItem('user'));
        user.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(user));
      }, error => {
        this.alertifyService.error(error);
      });
  }

  initializeUploader() {
    const id = this.authService.decodedToken.nameid;
    const token = 'Bearer ' + localStorage.getItem('token');
    const URL = this.baseUrl + 'users/' + id + '/photos';

    this.uploader = new FileUploader({
      url: URL,
      authToken: token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const res: Photo = JSON.parse(response);
      const photo = {
        id: res.id,
        url: res.url,
        description: res.description,
        dateAdded: res.dateAdded,
        isMainPhoto: res.isMainPhoto,
        userId: id
      };

      if (photo.isMainPhoto) {
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem(
          'user',
          JSON.stringify(this.authService.currentUser)
        );
      }

      this.photos.push(photo);
    };
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
