import { Component,HostListener, OnInit } from '@angular/core';
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
    // this.getAllMenu();
  }

 
 
}
