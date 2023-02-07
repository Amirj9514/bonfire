import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('../checkout/checkout.module').then((m) => m.CheckoutModule),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('../order-history/order-history.module').then(
            (m) => m.OrderHistoryModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
