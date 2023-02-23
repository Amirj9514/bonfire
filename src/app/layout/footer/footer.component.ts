import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  dataFormLoacal: any;
  restaurantDetail: any;

  dat: string = '01/01/11 ,  23:03 ';
  constructor(private sharedS: SharedService) {}

  ngOnInit(): void {
    this.getDataFromLoc();
  }

  getDataFromLoc() {
    this.sharedS.getData().subscribe((val: any) => {
      this.dataFormLoacal = val;
      if (this.dataFormLoacal.restaurantDetail) {
        this.restaurantDetail = this.dataFormLoacal.restaurantDetail;
      }
    });
  }
}
