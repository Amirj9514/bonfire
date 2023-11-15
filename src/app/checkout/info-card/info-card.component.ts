import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Delivery_details,
  MenuItems,
  NewOrder,
} from 'src/app/shared/models/orderDetail';
import { MainService } from 'src/app/shared/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent implements OnInit {
  dataFromLocal: any;

  googleAddress: any;
  placeOrder: any = false;
  cartData: any[] = [];
  options: any = {
    componentRestrictions: { country: 'PAK' },
  };
  checkoutForm!: FormGroup;

  private orderDetail = new NewOrder();
  private deliveryD = new Delivery_details();
  private menu_items = new MenuItems();
  subTotal: number = 0;
  total: any = 0;
  deliveryFee: any = 0;

  formSubmited: boolean = false;
  taxAmount: number = 0;
  preLoader: boolean = false;
  deliverCheck: boolean = false;

  hideAddressFeild: boolean = false;

  constructor(
    private sharedS: SharedService,
    private mainS: MainService,
    private router: Router
  ) {
    this.checkoutForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', Validators.required),
      mobile_no: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
        ),
      ]),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      address: new FormControl(''),
      instructions: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getDataFromLocal();
    this.setDafaultVal();

    this.mainS.placeOrdeSubject.subscribe((val: any) => {});
  }

  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;

        if (res?.orderTypeId && res.orderTypeId === '2') {
          this.removeValidator();
        } else {
          this.addValidator();
        }

        this.checkoutForm.updateValueAndValidity();

        if (this.dataFromLocal.cart) {
          this.cartData = this.dataFromLocal.cart;
        } else {
          this.cartData = [];
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  removeValidator() {
    this.checkoutForm.controls['latitude'].removeValidators([
      Validators.required,
    ]);
    this.checkoutForm.controls['longitude'].removeValidators([
      Validators.required,
    ]);
    this.checkoutForm.controls['latitude'].updateValueAndValidity();

    this.checkoutForm.controls['longitude'].updateValueAndValidity();
    this.hideAddressFeild = true;
  }

  addValidator() {
    this.checkoutForm.controls['latitude'].addValidators([Validators.required]);
    this.checkoutForm.controls['longitude'].addValidators([
      Validators.required,
    ]);
    this.hideAddressFeild = false;
    this.checkoutForm.controls['latitude'].updateValueAndValidity();

    this.checkoutForm.controls['longitude'].updateValueAndValidity();
  }

  setDafaultVal() {
    let userDetail = this.dataFromLocal.user;
    if (userDetail) {
      this.checkoutForm.get('email')?.setValue(userDetail.email);
      this.checkoutForm.get('firstName')?.setValue(userDetail.first_name);
      this.checkoutForm.get('lastName')?.setValue(userDetail.last_name);
      this.checkoutForm.get('mobile_no')?.setValue(userDetail.cell_num);
    }
  }
  handleAddressChange(address: Address) {
    this.googleAddress = address.formatted_address;

    this.checkoutForm
      .get('latitude')
      ?.setValue(address?.geometry?.location.lat().toString());

    this.checkoutForm
      .get('longitude')
      ?.setValue(address?.geometry?.location.lng().toString());

    this.getDeliveryChareges();
  }

  addData() {
    if (this.dataFromLocal.orderTypeId == 2) {
      this.sharedS.insertData({
        key: 'delivery_chg',
        val: 0,
      });
      this.deliveryFee = 0;
    }
    this.calSubtotal();
    this.calTax();
    this.calTotal();
    this.formSubmited = true;
    if (this.checkoutForm.valid) {
      let formData = this.checkoutForm.value;

      this.deliveryD = {
        town_id: '',
        town_block_id: 4,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: '',
        mobile_no: formData.mobile_no,
        address: `${this.googleAddress ? this.googleAddress : ''}  (${
          formData.address
        })`,
        longitude: formData.longitude,
        latitude: formData.latitude,
        instructions: formData.instructions,
        payment_type: '1',
      };

      if (
        this.dataFromLocal.cart.length >= 1 &&
        this.dataFromLocal.restaurantDetail &&
        this.dataFromLocal.user
      ) {
        this.cartData = this.dataFromLocal.cart;

        this.orderDetail = {
          order_type_id: this.dataFromLocal.orderTypeId,
          user_id: this.dataFromLocal.user.id,
          branch_id: this.dataFromLocal.restaurantDetail.id,
          delivery_details: this.deliveryD,
          delivery_charge: this.deliveryFee,
          order_detail: this.cartData,
          sub_total: this.subTotal,
          total: this.total,
          tax_amount: this.taxAmount,
        };

        console.log(this.orderDetail);

         this.calPlaceOrderAPI();
      } else {
        this.router.navigateByUrl('/');
      }
    }
  }

  checkAddressValue(event: any) {
    let value = event.target.value;
    if (!value) {
      this.checkoutForm.controls['latitude'].setValue(null);
      this.checkoutForm.controls['longitude'].setValue(null);
      this.checkoutForm.controls['latitude'].updateValueAndValidity();
      this.checkoutForm.controls['longitude'].updateValueAndValidity();
    }
  }
  getDeliveryChareges() {
    this.calSubtotal();
    this.sharedS.insertData({
      key: 'delivery_chg',
      val: 0,
    });
    let apiParam: any;
    apiParam = {
      branch_id: this.dataFromLocal.restaurantDetail.id,
      // latitude: this.checkoutForm.value.latitude,
      // longitude: this.checkoutForm.value.longitude,
      latitude: this.dataFromLocal.restaurantDetail.latitude,
      longitude: this.dataFromLocal.restaurantDetail.longitude,
      order_amt: this.subTotal,
    };
    this.preLoader = true;

    this.sharedS
      .sendPostRequest('GetDeliveryCharges', apiParam, null)
      .subscribe({
        next: (res: any) => {
          this.preLoader = false;
          if (res.Success) {
            this.deliveryFee = parseInt(res.Data);
            this.deliverCheck = true;
            console.log(this.cartData);

            this.sharedS.insertData({
              key: 'delivery_chg',
              val: parseInt(res.Data),
            });

            // this.orderDetail.delivery_charge = res.Data ? res.Data : 100;
          } else {
            this.checkoutForm.controls['latitude'].setValue(null);
            this.checkoutForm.controls['longitude'].setValue(null);
            this.checkoutForm.controls['latitude'].updateValueAndValidity();
            this.checkoutForm.controls['longitude'].updateValueAndValidity();
            alert(
              res.ErrorMessage ? res.ErrorMessage : 'Something Went Wrong!'
            );
          }
        },
        error: (err: any) => {
          this.preLoader = false;

          this.checkoutForm.controls['latitude'].setValue(null);
          this.checkoutForm.controls['longitude'].setValue(null);
          this.checkoutForm.controls['latitude'].updateValueAndValidity();
          this.checkoutForm.controls['longitude'].updateValueAndValidity();
          alert(err.error.message ? err.error.message : 'Server Error');
        },
      });
    // }
  }

  calPlaceOrderAPI() {
    this.preLoader = true;
    this.sharedS
      .sendPostRequest('WebPlaceOrder', this.orderDetail, null)
      .subscribe({
        next: (res: any) => {
          this.preLoader = false;
          if (res.Success !== false) {
            this.sharedS.insertData({ key: 'cart', val: undefined });
            // alert('Order Place Successfully');
            this.router.navigateByUrl('/history');
          } else {
            alert(res.ErrorMessage);
          }
        },

        error: (err: any) => {
          this.preLoader = false;
          alert(err.error.ErrorMessage);
        },
      });
  }

  edit() {
    this.router.navigateByUrl('/');
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
  calTax() {
    this.taxAmount =
      (this.dataFromLocal.restaurantDetail.tax_percent / 100) *
      Math.floor(this.subTotal);

    this.taxAmount = Math.round(this.taxAmount);
    this.calTotal();
  }
  calTotal() {
    if (this.dataFromLocal.restaurantDetail) {
      if (this.dataFromLocal.restaurantDetail.tax_include !== true) {
        this.total = this.subTotal + this.deliveryFee + this.taxAmount;
      } else {
        this.total = this.subTotal + this.deliveryFee;
      }
    }
  }
}
