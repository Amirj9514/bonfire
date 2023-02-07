import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';
import { MenuItems } from 'src/app/shared/models/orderDetail';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  searchIcon = faSearch;
  heartIcon = faHeart;
  private fragment!: string;

  menuArr: any[] = [];

  menuItems = new MenuItems();

  imgUrl: any = environment.apiImg;

  productArr: any[] = [];
  catId: any = null;

  // @HostLisner Var

  fullHeight: any;
  currentHeight: any;

  constructor(
    private SharedD: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private mainS: MainService
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment !== null) {
        this.fragment = fragment;
        this.viewportScroller.scrollToAnchor(this.fragment);
      }
    });
    this.SharedD.getData().subscribe({
      next: (res: any) => {
        if (res.restaurantDetail !== undefined) {
          this.productArr = res.restaurantDetail.lstCategory;
          if (res !== res.cart) {
            if (res.cart?.length !== this.menuArr?.length) {
              this.menuArr = res.cart;
            }
          }
        }
      },
    });
  }

  cardData(data: any) {
    if (this.catId === null) {
      this.catId = data.name;
      this.mainS.acticeCat(this.catId);
    } else if (data.id !== this.catId) {
      this.catId = data.name;
      this.mainS.acticeCat(this.catId);
    }
  }

  addToCart(menu: any) {
    this.menuItems = {
      order_detail_choice: [],
      imgUrl: menu.image,
      menu_id: menu.id,
      menu_qty: 1,
      menu_price: menu.price,
      menu_name: menu.name,
      menu_original_price: menu.price,
      menu_total_price: menu.price,
      menu_var_obj: [],
      menu_ingridient: menu.ingridient,
      menu_variation_id: null,
    };

    this.pushDataToArr(this.menuItems);
  }

  pushDataToArr(data: any) {
    let runCon = true;
    if (this.menuArr.length >= 1) {
      this.menuArr.map((val: any) => {
        if (val.menu_id === data.menu_id) {
          val.menu_qty = val.menu_qty + 1;
          runCon = false;
        }
      });
    }
    if (runCon === true) {
      this.menuArr.push(data);
    }

    this.SharedD.insertData({ key: 'cart', val: this.menuArr });
  }
}
