import { Component, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-past-order',
  templateUrl: './past-order.component.html',
  styleUrls: ['./past-order.component.scss'],
  styles: [
    `
      .card.disabled {
        opacity: 0.5;
      }
      .custom-header::after {
        content: none;
      }
    `,
  ],
})
export class PastOrderComponent implements OnInit {
  allOrders: any;
  prevOrders: any;
  downIcon = faChevronDown;
  disabled = false;
  dataFromLoacal: any;
  constructor(config: NgbAccordionConfig, private sharedS: SharedService) {
    config.closeOthers = true;
    config.type = 'info';
  }

  ngOnInit(): void {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLoacal = res;
        if (res.restaurantDetail !== undefined && res.user !== undefined) {
          this.calHistoryApi();
        }
      },
    });
  }
  calHistoryApi() {
    this.sharedS
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
    this.prevOrders = [];
    this.allOrders.map((val: any) => {
      if (val.status_id === '2') {
        this.prevOrders.push(val);
      }
    });
  }
  calSubtotal(data: any) {
    let subtotal = 0;

    subtotal = parseInt(data.price) * parseInt(data.quantity);
    return subtotal;
  }
}
