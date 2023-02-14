import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, CartComponent],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
})
export class LayoutModule {}
