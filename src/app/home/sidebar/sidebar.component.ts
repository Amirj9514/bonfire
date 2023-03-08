import { Component, OnInit, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { MainService } from 'src/app/shared/services/main.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  offsetFlag: boolean = true;

  activeCat: any;
  allCategories: any[] = [];
  fullScroll: any;
  private fragment: any = null;
  constructor(
    private SharedD: SharedService,
    private mainS: MainService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDataFromLocal();
    this.changeActiveCat();
    // this.defaultActiveCat(this.allCategories);
  }

  getDataFromLocal() {
    this.SharedD.getData().subscribe({
      next: (res: any) => {
        if (res.restaurantDetail !== undefined) {
          this.allCategories = res.restaurantDetail.lstCategory;
          this.activeCat = this.allCategories[0]?.id;
        }
      },
    });
  }
  defaultActiveCat(data: any) {
    // this.route.fragment.subscribe((fragment) => {
    //   if (fragment !== null) {
    //     this.activeCat = fragment;
    //   } else {
    //
    //   }
    // });
  }

  changeActiveCat() {
    this.mainS.activeCatSubject.subscribe({
      next: (res: any) => {
        this.activeCat = res;
        // this.viewportScroller.scrollToAnchor(this.activeCat);
      },
    });
  }

  selectCat(data: any) {
    this.activeCat = data.id;
    this.mainS.activeMenuId(data.id);
  }

  @HostListener('window:scroll', ['$event']) getScrollHeight(event: any) {
    this.fullScroll = document.getElementById('data')?.scrollHeight;
    if (window.pageYOffset > 400) {
      this.offsetFlag = false;
    } else {
      this.offsetFlag = true;
    }

    if (window.pageYOffset > this.fullScroll) {
      this.offsetFlag = true;
    }
  }
}
