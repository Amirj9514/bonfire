import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  activeCatSubject = new BehaviorSubject<any>(null);

  activeMenuSubject = new BehaviorSubject<any>(null);

  showCartSubject = new BehaviorSubject<boolean>(false);
  showSidebarSubject = new BehaviorSubject<boolean>(false);
  newOrderSubject = new BehaviorSubject<any>({});
  placeOrdeSubject = new BehaviorSubject<boolean>(false);
  userAllOrderSubject = new BehaviorSubject<any>([]);
  activeCatViewSubject = new BehaviorSubject<any>(null);
  constructor() {}

  acticeCat(data: any) {
    this.activeCatSubject.next(data);
  }

  showCart(data: boolean) {
    this.showCartSubject.next(data);
  }

  addNewOrder(data: any) {
    this.newOrderSubject.next(data);
  }

  placeOrder(data: boolean) {
    this.placeOrdeSubject.next(data);
  }

  showSidebar(data: boolean) {
    this.showSidebarSubject.next(data);
  }

  userAllOrder(data: any) {
    this.userAllOrderSubject.next(data);
  }

  activeMenuId(data: any) {
    this.activeMenuSubject.next(data);
  }
}
