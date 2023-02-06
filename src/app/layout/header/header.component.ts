import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faLocationArrow,
  faBars,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbModalConfig,
  NgbModal,
  NgbOffcanvas,
  NgbOffcanvasConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  locationIcon = faLocationArrow;
  addIcon = faPlus;
  removeIcon = faMinus;
  loginIcon = faUser;
  menuIcon = faBars;
  closeResult = '';
  cartData: any[] = [];

  orderType: any = false;

  //var for calculate total and subtoal

  subTotal: any = 0;
  total: any = 0;

  // modalData = {
  //   orderType: 1,
  //   cityId: 1,
  //   locationId: 2,
  // };
  constructor(
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private sharedS: SharedService,
    configs: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas
  ) {
    configs.position = 'end';
  }

  ngOnInit(): void {
    // this.sharedS.getData().subscribe({
    //   next: (res: any) => {
    //     console.log(res.bonfire);
    //     if (res.bonfire === undefined) {
    //       this.config.backdrop = 'static';
    //       this.config.keyboard = false;
    //     }
    //   },
    // });

    this.getDataFromLocal();
    this.calSubtotal();
  }

  // getting Data from Local Storage
  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        if (res.cart !== undefined) {
          this.cartData = res.cart;
        }
      },
    });
  }

  // location Modal open Function
  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {}
      );
  }

  // cart open funvtion

  openCart(cart: any) {
    // this.calSubtotal();
    this.offcanvasService
      .open(cart, { ariaLabelledBy: 'offcanvas-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {}
      );
  }

  decreaseQyt(index: any) {
    if (this.cartData[index].menu_qty !== 1) {
      this.cartData[index].menu_qty = this.cartData[index].menu_qty - 1;
      this.sharedS.insertData({ key: 'cart', val: this.cartData });
      this.calSubtotal();
    }
  }

  increaseQyt(index: any) {
    this.cartData[index].menu_qty = this.cartData[index].menu_qty + 1;
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
  }

  removeItem(index: any) {
    this.cartData.splice(index, 1);
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
  }

  calSubtotal() {
    let tota = 0;
    this.cartData.map((item: any) => {
      var subTotal = 0;

      subTotal = parseInt(item.menu_price) * parseInt(item.menu_qty) + subTotal;

      tota = tota + subTotal;
    });
    this.subTotal = tota;
  }

  changeOrderType() {
    this.orderType = !this.orderType;

    console.log(this.orderType);
  }
}
