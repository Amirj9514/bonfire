import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './banner/banner.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { MenuVariationComponent } from './menu-variation/menu-variation.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    SidebarComponent,
    ProductPageComponent,
    MenuVariationComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule, NgbAccordionModule],
})
export class HomeModule {}
