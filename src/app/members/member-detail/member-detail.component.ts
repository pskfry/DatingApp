import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_models/User';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';
import { TabsetComponent } from '../../../../node_modules/ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs') memberTabs: TabsetComponent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.route.queryParams.subscribe(params => {
      this.memberTabs.tabs[params['tab']].active = true;
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageSize: NgxGalleryImageSize.Contain,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];

    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }

    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

}
