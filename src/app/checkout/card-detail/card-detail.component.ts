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
  constructor(private sharedS: SharedService, private mainS: MainService) {}

  ngOnInit(): void {
    this.getDataFromLocal();
  }

  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;

        if (this.dataFromLocal.cart) {
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
  placeOrder() {
    this.mainS.placeOrder(true);
  }
}
