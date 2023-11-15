import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';

import { faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

import { MainService } from 'src/app/shared/services/main.service';
import { MenuItems } from 'src/app/shared/models/orderDetail';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  @ViewChild('cards') private parentRef!: ElementRef<HTMLElement>;
  @ViewChild('menuVar') menuVar: any;
  searchIcon = faSearch;
  heartIcon = faHeart;
  addIcon = faPlus;
  removeIcon = faMinus;

  menuArr: any[] = [];

  menuItems = new MenuItems();
  selectedMenu: any;

  imgUrl: any = environment.apiImg;
  dataFromLoacal: any;
  productArr: any[] = [];
  catId: any = null;
  closeResult = '';
  viewId: any;

  // @HostLisner Var

  fullHeight: any;
  currentHeight: any;

  constructor(
    private SharedD: SharedService,

    private elementRef: ElementRef,
    private mainS: MainService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.mainS.activeMenuSubject.subscribe({
      next: (res: any) => {
        if (res) {
          const element = this.elementRef.nativeElement.querySelector(
            '#item-' + res
          );
          element.scrollIntoView({ behavior: 'smooth' });
        }
      },
    });
    this.SharedD.getData().subscribe({
      next: (res: any) => {
        this.dataFromLoacal = res;
        if (res.restaurantDetail !== undefined) {
          this.productArr = res.restaurantDetail.lstCategory;
          if (res.cart !== undefined) {
            if (res.cart.length !== this.menuArr.length) {
              this.menuArr = res.cart;
            }
          } else {
            this.menuArr = [];
          }
        }
      },
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.getChildren();
  }

  public getChildren() {
    const parentElement = this.parentRef.nativeElement.children;
    for (let i = 0; i < parentElement.length; i++) {
      if (
        parentElement[i].getBoundingClientRect().y < 100 &&
        parentElement[i].getBoundingClientRect().y > 0
      ) {
        this.viewId = parseInt(parentElement[i].id);
        this.mainS.acticeCat(this.viewId);
      }
    }
  }

  cardData(data: any) {
    if (this.catId === null) {
      this.catId = data.id;
      this.mainS.acticeCat(this.catId);
    } else if (data.id !== this.catId) {
      this.catId = data.id;
      this.mainS.acticeCat(this.catId);
    }
  }

  addToCart(menu: any) {
    this.selectedMenu = menu;

    if (
      (menu.menu_variations &&
        menu.choice_group &&
        menu.choice_group.length > 0) ||
      menu.menu_variations.length > 0
    ) {
      this.open(this.menuVar);
    } else {
      this.menuItems = {
        order_detail_choice: [],
        imgUrl: menu.image,
        id: menu.id,
        quantity: 1,
        price: menu.price,
        menu_name: menu.name,
        menu_original_price: menu.price,
        menu_total_price: menu.price,
        menu_var_obj: [],
        menu_ingridient: menu.ingridient,
        menu_variation_id: null,
      };

      this.pushDataToArr(this.menuItems);
    }
  }

  pushDataToArr(data: any) {
    let runCon = true;
    if (this.menuArr !== undefined) {
      if (this.menuArr.length >= 1) {
        this.menuArr.map((val: any) => {
          if (val.id === data.id) {
            val.quantity = val.quantity + 1;
            runCon = false;
          }
        });
      }
    }

    if (runCon === true) {
      this.menuArr.push(data);
    }

    this.SharedD.insertData({ key: 'cart', val: this.menuArr });
  }

  chkItem(data: any) {
    let status = false;
    if (this.menuArr && this.menuArr.length >= 1) {
      for (let val of this.menuArr) {
        if (val.id === data.id) {
          status = true;
          break;
        } else {
          status = false;
        }
      }
    }
    return status;
  }

  chkQyt(data: any) {
    let status = 1;
    if (this.menuArr && this.menuArr.length >= 1) {
      for (let val of this.menuArr) {
        if (val.id === data.id) {
          status = val.quantity;

          break;
        } else {
          status = 1;
        }
      }
    }
    return status;
  }

  decreaseQyt(data: any) {
    if (this.menuArr) {
      this.menuArr.map((menu: any) => {
        if (menu.id === data.id) {
          if (menu.quantity > 1) {
            menu.quantity = menu.quantity - 1;
          }
        }
      });

      this.SharedD.insertData({ key: 'cart', val: this.menuArr });
    }
  }
  increaseQyt(data: any) {
    if (this.menuArr) {
      this.selectedMenu = data;

      if (
        (data.menu_variations &&
          data.choice_group &&
          data.choice_group.length > 0) ||
        data.menu_variations.length > 0
      ) {
        this.open(this.menuVar);
      } else {
        this.menuArr.map((menu: any) => {
          if (menu.id === data.id) {
            menu.quantity = menu.quantity + 1;
          }
        });
        this.SharedD.insertData({ key: 'cart', val: this.menuArr });
      }
    }
  }

  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnDestroy(): void {
    this.mainS.activeMenuId(1);
  }
}
