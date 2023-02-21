import { Component, OnInit, OnDestroy } from '@angular/core';

import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-active-order',
  templateUrl: './active-order.component.html',
  styleUrls: ['./active-order.component.scss'],
})
export class ActiveOrderComponent implements OnInit {
  dataFromLoacal: any;
  allOrders!: any[];
  activeOrders!: any[];

  constructor(private mainS: MainService) {}

  ngOnInit(): void {
    this.mainS.userAllOrderSubject.subscribe({
      next: (res: any) => {
        this.allOrders = res;
        if (this.allOrders && this.allOrders.length >= 1) {
          this.getActiveOrder();
        }
      },
    });
    // this.getDataFromLocal();
  }

  getActiveOrder() {
    this.activeOrders = [];
    this.allOrders.map((val: any) => {
      if (val.status_id !== '2' || val.status_id !== '8') {
        this.activeOrders.push(val);
      }
    });
  }

  calSubtotal(data: any) {
    let subtotal = 0;

    subtotal = parseInt(data.price) * parseInt(data.quantity);
    return subtotal;
  }
}
