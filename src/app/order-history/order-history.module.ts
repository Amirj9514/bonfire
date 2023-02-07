import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { OrderHistoryComponent } from './order-history.component';
import { SharedModule } from '../shared/shared.module';
import { ActiveOrderComponent } from './active-order/active-order.component';
import { PastOrderComponent } from './past-order/past-order.component';

@NgModule({
  declarations: [OrderHistoryComponent, ActiveOrderComponent, PastOrderComponent],
  imports: [CommonModule, OrderHistoryRoutingModule, SharedModule],
})
export class OrderHistoryModule {}
