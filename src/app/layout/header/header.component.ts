import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import {
  faLocationArrow,
  faBars,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbModalConfig,
  NgbModal,
  NgbOffcanvas,
  NgbOffcanvasConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { NewOrder } from 'src/app/shared/models/orderDetail';
import { MainService } from 'src/app/shared/services/main.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('content2') content3: any;
  locationIcon = faLocationArrow;
  addIcon = faPlus;
  removeIcon = faMinus;
  loginIcon = faUser;
  menuIcon = faBars;
  closeResult = '';

  preLoader: boolean = false;

  dataFromLocal!: any;
  cartData: any[] = [];

  branchesDetail: any[] = [];

  imageUrl: any = environment.apiImg;

  orderType: any = false;
  //var for calculate total and subtoal

  branchForm!: FormGroup;
  restaurantDetail: any;
  constructor(
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private sharedS: SharedService,
    private mainS: MainService,
    configs: NgbOffcanvasConfig,
    private router: Router,
    private offcanvasService: NgbOffcanvas
  ) {
    // Cart Position
    configs.position = 'end';

    // Select Branch Form
    this.branchForm = new FormGroup({
      order_type: new FormControl('3'),
      selectedBranch: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getDataFromLocal();

    // Stop To Close Model if selected restaurant Branch Detail are not store in Local Storage
    if (this.dataFromLocal.restaurantDetail === undefined) {
      this.config.backdrop = 'static';
      this.config.keyboard = false;
    }
  }

  ngAfterViewInit() {
    this.openModel();
  }

  // open Select Branch Model if restaurant Detail are not store in Local Storage
  openModel() {
    if (this.dataFromLocal.restaurantDetail === undefined) {
      this.open(this.content3);
    }
  }

  // getting Data from Local Storage
  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
        if (res.cart !== undefined) {
          this.cartData = res.cart;
        }
      },
    });
  }

  selectBranch() {
    if (this.branchForm.valid !== false) {
      if (this.dataFromLocal.restaurantDetail === undefined) {
        this.getAllMenu(this.branchForm.get('selectedBranch')?.value);
      } else {
        if (
          this.dataFromLocal.restaurantDetail.id !==
          parseInt(this.branchForm.get('selectedBranch')?.value)
        ) {
          this.getAllMenu(this.branchForm.get('selectedBranch')?.value);
        } else {
          this.modalService.dismissAll();
        }
      }
    }
    this.sharedS.insertData({
      key: 'orderTypeId',
      val: this.branchForm.value.order_type,
    });
  }

  getAllMenu(branch_id: any) {
    this.preLoader = true;
    let id = branch_id;
    this.sharedS
      .sendPostRequest(`WebAppMainData?branch_id=${id}&app_id=1`, null, null)
      .subscribe({
        next: (res: any) => {
          this.preLoader = false;
          if (res.Success !== false) {
            this.restaurantDetail = res.Data;
            this.storeDataToLoc();
          }
        },
        error: (err: any) => {
          this.preLoader = false;
        },
      });
  }

  storeDataToLoc() {
    this.sharedS.insertData({
      key: 'restaurantDetail',
      val: this.restaurantDetail,
    });

    this.sharedS.insertData({
      key: 'cart',
      val: undefined,
    });
    this.sharedS.insertData({
      key: 'user',
      val: undefined,
    });

    if (this.dataFromLocal.cart === undefined) {
      this.cartData = [];
    }

    this.modalService.dismissAll();
  }

  // Function On Submit Of Form Of  Select Branch Model

  selectOrderType(data: any) {
    this.branchForm.get('order_type')?.setValue(data);
  }

  calSubtotal(data: any) {
    let tota = 0;
    this.cartData.map((item: any) => {
      var subTotal = 0;
      subTotal = parseInt(item.price) * parseInt(item.quantity) + subTotal;
      tota = tota + subTotal;
    });

    return tota;
  }

  logout() {
    this.sharedS.insertData({
      key: 'user',
      val: undefined,
    });
    this.router.navigateByUrl('/auth/login');
  }

  // location Modal open Function
  open(content: any) {
    this.sharedS
      .sendGetRequest(
        `GetRestaurantBranchesNameAndId/${environment.restaurant_id}`,
        null
      )
      .subscribe({
        next: (res: any) => {
          if (res.Success === true) {
            this.branchesDetail = res.Data;
          }
        },
      });
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {}
      );
  }

  // cart open funvtion

  openCart() {
    this.mainS.showCart(true);
  }

  openSidebar() {
    this.mainS.showSidebar(true);
  }
}
