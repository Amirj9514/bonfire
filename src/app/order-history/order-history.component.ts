import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  $subscriptionOne!: Subscription;
  dataFromLocal: any;

  allOrders: any[] = [];

  preLoader: boolean = false;

  constructor(
    private sharedS: SharedService,
    private mainS: MainService
  ) {}

  ngOnInit(): void {
    this.getDataFromLoc();
  }

  getDataFromLoc() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
      },
    });
    if (this.dataFromLocal.restaurantDetail && this.dataFromLocal.user) {
      this.calHistoryApi();
    } else {
    }
  }

  calHistoryApi() {
    this.preLoader = true;
    this.sharedS
      .sendPostRequest(
        `WebOrderHistory?branchId=${this.dataFromLocal.restaurantDetail.id}&userId=${this.dataFromLocal.user.id}`,
        'N/A',
        'N/A'
      )
      .subscribe({
        next: (res: any) => {
          this.preLoader = false;
          if (res.Success !== false) {
            this.allOrders = res.Data;
            this.mainS.userAllOrder(this.allOrders);
          } else {
          }
        },
        error: (err: any) => {
          this.preLoader = false;
          alert(err.error.ErrorMessage);
        },
      });
  }

  ngOnDestroy(): void {
    // this.$subscriptionOne.unsubscribe();
  }
}
