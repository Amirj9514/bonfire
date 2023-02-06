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
  private fragment: any = null;
  constructor(
    private SharedD: SharedService,
    private mainS: MainService,
    private viewportScroller: ViewportScroller,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDataFromLocal();
    this.changeActiveCat();
    this.defaultActiveCat(this.allCategories);
  }

  getDataFromLocal() {
    this.SharedD.getData().subscribe({
      next: (res: any) => {
        if (res.restaurantDetail !== undefined) {
          this.allCategories = res.restaurantDetail.lstCategory;
        }
      },
    });
  }
  defaultActiveCat(data: any) {
    this.route.fragment.subscribe((fragment) => {
      if (fragment !== null) {
        this.activeCat = fragment;
      } else {
        this.activeCat = data[0].name;
      }
    });
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
  }

  @HostListener('window:scroll', ['$event']) getScrollHeight(event: any) {
    if (window.pageYOffset > 400) {
      this.offsetFlag = false;
    } else {
      this.offsetFlag = true;
    }
  }
}
