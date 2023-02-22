import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  addIcon = faPlus;
  removeIcon = faMinus;
  private fragment!: string;

  menuArr: any[] = [];

  menuItems = new MenuItems();

  imgUrl: any = environment.apiImg;
  dataFromLoacal: any;
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
        this.dataFromLoacal = res;
        if (res.restaurantDetail !== undefined) {
          this.productArr = res.restaurantDetail.lstCategory;
          if (res.cart !== undefined) {
            if (res.cart.length !== this.menuArr.length) {
              this.menuArr = res.cart;
            }
          } else {
            this.menuArr = [];
          }
        }
      },
    });
  }
  @HostListener('window:scroll', ['$event']) getScrollHeight(event: any) {
    // var data = window.document.getElementById('data');
    // console.log(data);
    
    var da = window.document.getElementsByClassName('data');
    // console.log(da);
    
    // for (let i = 0; i < da.length; i++) {
    //   console.log(da[i]);
    // }
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
      id: menu.id,
      quantity: 1,
      price: menu.price,
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
    if (this.menuArr !== undefined) {
      if (this.menuArr.length >= 1) {
        this.menuArr.map((val: any) => {
          if (val.id === data.id) {
            val.quantity = val.quantity + 1;
            runCon = false;
          }
        });
      }
    }

    if (runCon === true) {
      this.menuArr.push(data);
    }

    this.SharedD.insertData({ key: 'cart', val: this.menuArr });
  }

  chkItem(data: any) {
    let status = false;
    if (this.menuArr && this.menuArr.length >= 1) {
      for (let val of this.menuArr) {
        if (val.id === data.id) {
          status = true;
          break;
        } else {
          status = false;
        }
      }
    }
    return status;
  }

  chkQyt(data: any) {
    let status = 1;
    if (this.menuArr && this.menuArr.length >= 1) {
      for (let val of this.menuArr) {
        if (val.id === data.id) {
          status = val.quantity;

          break;
        } else {
          status = 1;
        }
      }
    }
    return status;
  }

  decreaseQyt(data: any) {
    if (this.menuArr) {
      this.menuArr.map((menu: any) => {
        if (menu.id === data.id) {
          if (menu.quantity > 1) {
            menu.quantity = menu.quantity - 1;
          }
        }
      });

      this.SharedD.insertData({ key: 'cart', val: this.menuArr });
    }
  }
  increaseQyt(data: any) {
    if (this.menuArr) {
      this.menuArr.map((menu: any) => {
        if (menu.id === data.id) {
          menu.quantity = menu.quantity + 1;
        }
      });
    }
    this.SharedD.insertData({ key: 'cart', val: this.menuArr });
  }
}
