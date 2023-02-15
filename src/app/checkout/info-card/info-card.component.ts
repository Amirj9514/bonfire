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
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
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

        if (this.dataFromLocal.cart) {
          this.cartData = this.dataFromLocal.cart;
        } else {
          this.cartData = [];
          this.router.navigateByUrl('/');
        }
      },
    });
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
    console.log(address.formatted_address);
    console.log(address.geometry.location.lat().toString());
    console.log(address.geometry.location.lng().toString());

    // store lat lng

    this.checkoutForm
      .get('latitude')
      ?.setValue(address?.geometry?.location.lat().toString());

    this.checkoutForm
      .get('longitude')
      ?.setValue(address?.geometry?.location.lng().toString());
  }

  addData() {
    this.calSubtotal();
    this.calTax();
    this.calTotal();
    this.formSubmited = true;
    console.log(this.checkoutForm.valid);

    if (this.checkoutForm.valid === true) {
      let formData = this.checkoutForm.value;
      console.log(this.checkoutForm.value);

      this.deliveryD = {
        town_id: '',
        town_block_id: 4,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: '',
        mobile_no: formData.mobile_no,
        address: formData.address,
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
          order_detail: this.cartData,
          sub_total: this.subTotal,
          total: this.total,
          tax_amount: this.taxAmount,
        };
 
        this.calPlaceOrderAPI();
      } else {
        this.router.navigateByUrl('/');
      }
    }
  }

  calPlaceOrderAPI() {
    this.sharedS
      .sendPostRequest('WebPlaceOrder', this.orderDetail, null)
      .subscribe({
        next: (res: any) => {
          if (res.Success !== false) {
            this.sharedS.insertData({ key: 'cart', val: undefined });
            alert('Order Place Successfully');
            this.router.navigateByUrl('/');
          } else {
            alert(res.ErrorMessage);
          }
        },

        error: (err: any) => {
          alert(err.error.ErrorMessage);
        },
      });
  }

  edit() {
    this.router.navigateByUrl('');
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
    this.total = this.subTotal + this.deliveryFee + this.taxAmount;
  }
}
