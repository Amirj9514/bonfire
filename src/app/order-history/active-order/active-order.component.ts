import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-active-order',
  templateUrl: './active-order.component.html',
  styleUrls: ['./active-order.component.scss'],
})
export class ActiveOrderComponent implements OnInit {
  dataFromLoacal: any;
  allOrders: any[] = [];
  activeOrders: any[] = [];

  constructor(
    private shareS: SharedService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDataFromLocal();
  }
  getDataFromLocal() {
    this.shareS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLoacal = res;
        if (this.dataFromLoacal.user === undefined) {
          this.router.navigateByUrl('/auth/login');
        } else if (this.dataFromLoacal.restaurantDetail === undefined) {
          this.router.navigateByUrl('/');
        } else if (
          this.dataFromLoacal.user &&
          this.dataFromLoacal.restaurantDetail
        ) {
          this.calHistoryApi();
        }
      },
    });
  }

  calHistoryApi() {
    this.shareS
      .sendPostRequest(
        `WebOrderHistory?branchId=${this.dataFromLoacal.restaurantDetail.id}&userId=${this.dataFromLoacal.user.id}`,
        null,
        null
      )
      .subscribe({
        next: (res: any) => {
          if (res.Success !== false) {
            this.allOrders = res.Data;
            this.getActiveOrder();
          }
        },
        error: (err: any) => {
          alert(err.error.ErrorMessage);
        },
      });
  }

  getActiveOrder() {
    this.activeOrders = [];
    this.allOrders.map((val: any) => {
      if (val.status_id !== '2' || val.status_id !== '8') {
        this.activeOrders.push(val);
      }
    });

    console.log(this.activeOrders);
  }

  calSubtotal(data: any) {
    let subtotal = 0;

    subtotal = parseInt(data.price) * parseInt(data.quantity);
    return subtotal;
  }

  // ngOnDestroy(): void {
  //   this.dataFromLoacal.unsubscribe();
  // }
}
