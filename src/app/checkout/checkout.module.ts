import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

import { InfoCardComponent } from './info-card/info-card.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CheckoutComponent, InfoCardComponent, CardDetailComponent],
  imports: [CommonModule, CheckoutRoutingModule, SharedModule],
})
export class CheckoutModule {}
