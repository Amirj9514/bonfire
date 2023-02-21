import { Component, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from 'src/app/shared/services/main.service';
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
  constructor(config: NgbAccordionConfig, private mainS: MainService) {
    config.closeOthers = true;
    config.type = 'info';
  }

  ngOnInit(): void {
    this.mainS.userAllOrderSubject.subscribe({
      next: (res: any) => {
        this.allOrders = res;
        if (this.allOrders && this.allOrders.length >= 1) {
          this.getActiveOrder();
        }
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
