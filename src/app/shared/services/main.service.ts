import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  activeCatSubject = new BehaviorSubject<any>(null);
  constructor() {}

  acticeCat(data: any) {
    this.activeCatSubject.next(data);
  }
}
