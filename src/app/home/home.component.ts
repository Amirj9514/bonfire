import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  restaurantDetail: any = null;

  constructor(private sharedS: SharedService) {}

  ngOnInit(): void {
    this.getAllMenu();
  }
  getAllMenu() {
    this.sharedS
      .sendPostRequest('WebAppMainData?branch_id=1219&app_id=1', null, null)
      .subscribe({
        next: (res: any) => {
          if (res.Success !== false) {
            this.restaurantDetail = res.Data;
            this.storeDataToLoc();
          }
        },
      });
  }

  storeDataToLoc() {
    this.sharedS.getData().subscribe((val: any) => {
      if (val.restaurantDetail === undefined) {
        this.sharedS.insertData({
          key: 'restaurantDetail',
          val: this.restaurantDetail,
        });
      }
    });
  }
}
