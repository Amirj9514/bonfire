import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from 'src/app/shared/services/main.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @ViewChild('cart') cart: any;
  addIcon = faPlus;
  removeIcon = faMinus;

  showCart: boolean = false;
  dataFromLocal!: any;
  imageUrl: any = environment.apiImg;
  cartData: any[] = [];
  subTotal: any = 0;
  deliveryFee: any = 0;
  total: any = 0;

  orderTypeId: any = '3';

  orderType: boolean = false;

  constructor(
    configs: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas,
    private sharedS: SharedService,
    private mainS: MainService,
    private router: Router
  ) {
    configs.position = 'end';
  }

  ngOnInit(): void {
    this.getDataFromLocal();
    this.open();
  }

  open() {
    this.mainS.showCartSubject.subscribe({
      next: (res: any) => {
        if (res === true) {
          if (this.dataFromLocal.cart === undefined) {
            this.cartData = [];
            this.calSubtotal();
            this.calTotal();
          }
          if (this.offcanvasService.hasOpenOffcanvas() !== true) {
            this.openCart(this.cart);
          }
        }
      },
    });
  }

  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
        if (res.cart !== undefined) {
          this.cartData = res.cart;
          this.calSubtotal();
          this.calTotal();
        }
        if (this.dataFromLocal.orderTypeId) {
          this.orderTypeId = this.dataFromLocal.orderTypeId;
        }

        if (this.orderTypeId === '2') {
          this.orderType = true;
        } else {
          this.orderType = false;
        }
      },
    });
  }

  changeOrderType() {
    this.orderType = !this.orderType;

    if (this.orderType === true) {
      this.sharedS.insertData({
        key: 'orderTypeId',
        val: '2',
      });
    } else {
      this.sharedS.insertData({
        key: 'orderTypeId',
        val: '3',
      });
    }
  }

  decreaseQyt(index: any) {
    if (this.cartData[index].quantity !== 1) {
      this.cartData[index].quantity = this.cartData[index].quantity - 1;
      this.sharedS.insertData({ key: 'cart', val: this.cartData });
      this.calSubtotal();
    }
  }

  increaseQyt(index: any) {
    this.cartData[index].quantity = this.cartData[index].quantity + 1;
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
    this.calTotal();
  }

  removeItem(index: any) {
    this.cartData.splice(index, 1);
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
    this.calTotal();
  }

  calSubtotal() {
    let tota = 0;
    this.cartData.map((item: any) => {
      var subTotal = 0;
      subTotal = parseInt(item.price) * parseInt(item.quantity) + subTotal;
      tota = tota + subTotal;
    });
    this.subTotal = tota;
  }
  calTotal() {
    this.total = this.subTotal + this.deliveryFee;
  }

  placeOrder() {
    let auth = this.checkAuth();
    this.offcanvasService.dismiss(); // close Cart

    if (auth !== true) {
      this.router.navigateByUrl('/auth/login');
    } else {
      this.router.navigateByUrl('/checkout');
    }
  }

  checkAuth() {
    if (this.dataFromLocal.user) {
      return true;
    } else {
      return false;
    }
  }

  // cart open funvtion

  openCart(cart: any) {
    // this.calSubtotal();
    this.offcanvasService
      .open(cart, { ariaLabelledBy: 'offcanvas-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  ngOnDestroy(): void {
    this.mainS.showCart(false); //also close cart to prevent Deisgn error
  }
}
