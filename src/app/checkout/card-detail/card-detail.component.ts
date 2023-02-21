import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit {
  dataFromLocal: any;

  cartData: any[] = [];
  subTotal: number = 0;
  total: number = 0;
  deliveryFee: number = 0;
  taxAmount!: number;
  restaurantDetail: any = {};
  constructor(private sharedS: SharedService, private mainS: MainService) {}

  ngOnInit(): void {
    this.getDataFromLocal();
  }

  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
        this.calSubtotalH();
        this.calTax();
        this.restaurantDetail = this.dataFromLocal.restaurantDetail;
        if (this.dataFromLocal.cart !== undefined) {
          this.cartData = this.dataFromLocal.cart;
        } else {
          this.cartData = [];
        }
      },
    });
  }

  calSubTotal(item: any) {
    let da = parseInt(item.quantity) * parseInt(item.price);
    return da;
  }

  calSubtotalH() {
    let tota = 0;
    this.cartData.map((item: any) => {
      var subTotal = 0;
      subTotal = parseInt(item.price) * parseInt(item.quantity) + subTotal;
      tota = tota + subTotal;
    });
    this.subTotal = tota;
    return this.subTotal;
  }

  calTax() {
    this.taxAmount =
      (this.dataFromLocal.restaurantDetail.tax_percent / 100) *
      Math.floor(this.subTotal);

    this.taxAmount = Math.round(this.taxAmount);
    this.calTotal();
    return this.taxAmount;
  }
  calTotal() {
    if (this.dataFromLocal.restaurantDetail) {
      if (this.dataFromLocal.restaurantDetail.tax_include !== true) {
        this.total = this.subTotal + this.deliveryFee + this.taxAmount;
      } else {
        this.total = this.subTotal + this.deliveryFee;
      }
    }
    return this.total;
  }
}
