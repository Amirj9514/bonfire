import { Component, OnInit } from '@angular/core';
import {
  NgbCarouselModule,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  image = [{ img: '../../../assets/banner1.jpg' }];
  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = false;
  }

  ngOnInit(): void {}
}
