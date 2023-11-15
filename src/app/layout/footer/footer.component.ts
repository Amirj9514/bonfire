import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  dataFormLoacal: any;
  restaurantDetail: any;
  imageUrl: any = environment.apiImg;
  logoImg: any;

  dat: string = '01/01/11 ,  23:03 ';
  constructor(private sharedS: SharedService) {}

  ngOnInit(): void {
    this.getDataFromLoc();
  }

  getDataFromLoc() {
    this.sharedS.getData().subscribe((val: any) => {
      this.logoImg =
        environment.apiImg +
        val.allBranches[0].id +
        '/images/' +
        val.allBranches[0].logo;
      this.dataFormLoacal = val;
      if (this.dataFormLoacal.restaurantDetail) {
        this.restaurantDetail = this.dataFormLoacal.restaurantDetail;
      }
    });
  }
}
