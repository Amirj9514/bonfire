import {
  AfterContentInit,
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  dataFromLocal!: any;
  cartData: any[] = [];

  branchesDetail: any[] = [];

  imageUrl: any = environment.apiImg;

  orderType: any = '3';
  //var for calculate total and subtoal

  subTotal: any = 0;
  deliveryFee: any = 0;
  total: any = 0;

  branchForm!: FormGroup;

  // modalData = {
  //   orderType: 1,
  //   cityId: 1,
  //   locationId: 2,
  // };

  private newOrder = new NewOrder();
  restaurantDetail: any;
  constructor(
    private modalService: NgbModal,
    public config: NgbModalConfig,
    private sharedS: SharedService,
    configs: NgbOffcanvasConfig,
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
    if (this.dataFromLocal.restaurantDetail === undefined) {
      this.config.backdrop = 'static';
      this.config.keyboard = false;
    }
  }

  ngAfterViewInit() {
    this.getAllBranches();
  }

  getAllBranches() {
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
          this.calSubtotal();
          this.calTotal();
        }
      },
    });
  }

  selectBranch() {
    if (this.branchForm.valid !== false) {
      this.getAllMenu(this.branchForm.get('selectedBranch')?.value);
    }
  }

  getAllMenu(branch_id: any) {
    let id = branch_id;
    this.sharedS
      .sendPostRequest(`WebAppMainData?branch_id=${id}&app_id=1`, null, null)
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
    this.sharedS.insertData({
      key: 'restaurantDetail',
      val: this.restaurantDetail,
    });
    this.sharedS.insertData({
      key: 'cart',
      val: undefined,
    });
    if (this.dataFromLocal.cart === undefined) {
      this.cartData = [];
    }

    this.modalService.dismissAll();
  }

  decreaseQyt(index: any) {
    if (this.cartData[index].quantity !== 1) {
      this.cartData[index].quantity = this.cartData[index].quantity - 1;
      this.sharedS.insertData({ key: 'cart', val: this.cartData });
      this.calSubtotal();
    }
  }

  increaseQyt(index: any) {
    this.cartData[index].quantity = this.cartData[index].quantity + 1;
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
    this.calTotal();
  }

  removeItem(index: any) {
    this.cartData.splice(index, 1);
    this.sharedS.insertData({ key: 'cart', val: this.cartData });
    this.calSubtotal();
    this.calTotal();
  }

  calSubtotal() {
    let tota = 0;
    this.cartData.map((item: any) => {
      var subTotal = 0;
      subTotal = parseInt(item.price) * parseInt(item.quantity) + subTotal;
      tota = tota + subTotal;
    });
    this.subTotal = tota;
  }
  calTotal() {
    this.total = this.subTotal + this.deliveryFee;
  }

  changeOrderType() {
    this.orderType = !this.orderType;
  }

  // Function On Submit Of Form Of  Select Branch Model

  selectOrderType(data: any) {
    this.orderType = data;
    this.branchForm.get('order_type')?.setValue(data);
  }

  placeOrder() {
    this.newOrder = {
      user_id: '',
      branch_id: '',
      order_type_id: '',
      sub_total: this.subTotal,
      total: this.total,
      delivery_details: {},
      order_detail: [],
    };
    // this.checkAuth()
  }

  checkAuth() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {},
    });
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

  openCart(cart: any) {
    // this.calSubtotal();
    this.offcanvasService
      .open(cart, { ariaLabelledBy: 'offcanvas-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {}
      );
  }
}
