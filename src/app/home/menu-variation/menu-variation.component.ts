import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-menu-variation',
  templateUrl: './menu-variation.component.html',

  styleUrls: ['./menu-variation.component.scss'],
  providers: [NgbAccordion],
})
export class MenuVariationComponent implements OnInit {
  @ViewChild('acc') acc: any;
  @ViewChild('accd') accd: any;
  @Input() menu: any;

  showChoiceGrp: boolean = false;
  choiceGrpRadio: boolean = false;
  openArr: any[] = [];
  newSelectedVariation: any;

  isChoiceOnly: boolean = false;

  choiceForm!: FormGroup;

  menu_var: any;
  choiceGrp: any[] = [];

  cart: any[] = [];

  constructor(
    private accordion: NgbAccordion,
    private modalService: NgbModal,
    private sharedS: SharedService
  ) {
    this.choiceForm = new FormGroup({});
  }

  ngOnInit(): void {
    if (this.menu.choice_group && this.menu?.choice_group.length > 0) {
      this.isChoiceOnly = true;
      this.menu.choice_group.map((choiceGrp: any, index: number) => {
        if (choiceGrp.min_choices > 0) {
          this.choiceForm.addControl(choiceGrp.id, new FormControl(false));
        } else {
          this.choiceForm.addControl(choiceGrp.id, new FormControl(true));
        }
        this.openArr.push('p' + index);
      });

      this.menu_var = {
        var_id: '',
        var_price: '',
        variation_name: null,
        var_choice_grp: [],
      };
    } else {
      this.isChoiceOnly = false;
    }

    this.sharedS.getData().subscribe((data: any) => {
      this.cart = data.cart ? data.cart : [];
    });
  }

  selectedVariation(data: any) {
    this.showChoiceGrp = false;
    this.newSelectedVariation = [];

    this.choiceGrp = [];
    this.newSelectedVariation = data;

    // Reset On Click First

    if (data.choice_groups && data.choice_groups.length > 0) {
      this.showChoiceGrp = true;

      data.choice_groups.map((choiceGrp: any, index: number) => {
        if (choiceGrp.min_choices > 0) {
          this.choiceForm.addControl(choiceGrp.id, new FormControl(false));
        } else {
          this.choiceForm.addControl(choiceGrp.id, new FormControl(true));
        }

        this.openArr.push('p' + index);
      });
    }
    this.menu_var = {
      var_id: data.id,
      var_price: data.price,
      variation_name: data.name,
      var_choice_grp: [],
    };
  }

  selecteChoice(choice: any, choiceGrp: any, type: string) {
    let choi = {
      choice_id: choice.id,
      choice_name: choice.name,
      choice_price: Math.round(choice.price),
    };

    if (this.choiceGrp && this.choiceGrp.length > 0) {
      let cond1 = false;
      this.choiceGrp.map((grp: any) => {
        if (grp.choice_grp_id === choiceGrp.id) {
          cond1 = true;
          let cond = false;
          // if (type === 'radio') {
          //   grp.choices = [];
          // }

          if (grp.choices.length > 0) {
            grp.choices.map((choice: any) => {
              if (choice.choice_id === choi.choice_id) {
                cond = true;

                const indexToRemove = grp.choices.findIndex(
                  (item: any) => item.choice_id === choice.choice_id
                );
                // Check if the item was found
                if (indexToRemove !== -1) {
                  // Remove the item from the array
                  grp.choices.splice(indexToRemove, 1);
                }
                if (this.checkValidation(choice, grp, 1)) {
                }
              }
            });
          }

          if (!cond) {
            grp.choices.push(choi);
            if (this.checkValidation(choice, grp, 2)) {
            }
          }
        }
      });

      if (!cond1) {
        let chsGrp: any = {
          choice_grp_id: choiceGrp.id,
          choice_grp_name: choiceGrp.name,
          max_choices: choiceGrp.max_choices,
          min_choices: choiceGrp.min_choices,
          choices: [
            {
              choice_id: choice.id,
              choice_name: choice.name,
              choice_price: Math.round(choice.price),
            },
          ],
        };

        this.choiceGrp.push(chsGrp);
        if (this.checkValidation(choice, chsGrp, 2)) {
        }
      }
    } else {
      let chsGrp: any = {
        choice_grp_id: choiceGrp.id,

        choice_grp_name: choiceGrp.name,
        max_choices: choiceGrp.max_choices,
        min_choices: choiceGrp.min_choices,
        choices: [
          {
            choice_id: choice.id,
            choice_name: choice.name,
            choice_price: Math.round(choice.price),
          },
        ],
      };

      this.choiceGrp.push(chsGrp);
      if (this.checkValidation(choice, chsGrp, 2)) {
      }
    }

    this.menu_var.var_choice_grp = this.choiceGrp;
  }

  checkValidation(choice: any, choiceGrp: any, callFrom: any) {
    let ret = false;

    console.log(
      choiceGrp.max_choices >= choiceGrp.choices.length,
      choiceGrp.choices.length >= choiceGrp.min_choices
    );

    if (callFrom === 1) {
      if (choiceGrp.choices.length >= choiceGrp.min_choices) {
        if (choiceGrp.choices.length <= choiceGrp.max_choices) {
          ret = true;
        }
      }
    } else {
      if (choiceGrp.choices.length >= choiceGrp.min_choices) {
        if (choiceGrp.max_choices >= choiceGrp.choices.length) {
          ret = true;
        }
      }
    }
    this.choiceForm.controls[choiceGrp.choice_grp_id].setValue(ret);

    console.log(ret);

    return ret;
  }

  selected(choice: any) {
    let ret = false;
    if (this.choiceGrp && this.choiceGrp.length > 0) {
      for (let i = 0; i < this.choiceGrp.length; i++) {
        const element = this.choiceGrp[i];
        for (let j = 0; j < element.choices.length; j++) {
          const choi = element.choices[j];
          if (choi.choice_id === choice.id) {
            ret = true;
          }
        }
      }
    }
    return ret;
  }

  validateMessage(choiceGrp: any) {
    let ret = false;

    if (!this.choiceForm.controls[choiceGrp.id].value === true) {
      ret = true;
    }

    return ret;
  }

  onAddOrder() {
    let menu = {
      order_detail_choice: [],
      imgUrl: this.menu.image,
      id: this.menu.id,
      quantity: 1,
      price: this.menu.price,
      menu_name: this.menu.name,
      menu_original_price: this.menu.price,
      menu_total_price: this.menu.price,
      menu_var_obj: this.menu_var,
      menu_ingridient: this.menu.ingridient,
      menu_variation_id: this.menu_var.var_id,
    };

    menu.price = this.calPriceWithChoice(menu);

    if (this.cart && this.cart.length > 1) {
      this.checkQyt(menu);
    } else {
      this.cart.push(menu);
    }
    this.sharedS.insertData({ key: 'cart', val: this.cart });
    this.closeModal();
  }

  calPriceWithChoice(menu: any) {
    let subTotal = 0;
    menu.menu_var_obj.var_choice_grp.map((val: any) => {
      val.choices.map((choice: any) => {
        subTotal = parseFloat(choice.choice_price) + subTotal;
      });
    });
    let total;
    if (this.isChoiceOnly) {
      total = Math.floor(menu.price) + subTotal;
    } else {
      total = Math.floor(menu.menu_var_obj.var_price) + subTotal;
    }

    return total;
  }

  disabledBtn() {
    let ret = false;
    for (const key in this.choiceForm.value) {
      if (this.choiceForm.value.hasOwnProperty(key)) {
        if (this.choiceForm.value[key] !== true) {
          ret = true;
          break; // Exit the loop early if a non-true value is found
        }
      }
    }

    return ret;
  }

  checkQyt(menu: any) {
    let incQyt = false;
    let choiceIds: any[] = [];
    let progChoiceIds: any[] = [];

    let progOrder = menu;

    // store splice orderItem in variable
    // check if item already exist then incerease qyt
    this.cart.map((order: any) => {
      if (parseInt(order.id) === parseInt(progOrder.id)) {
        if (order.menu_var_obj.var_choice_grp.length > 0) {
          if (
            parseInt(order.menu_variation_id) ===
            parseInt(progOrder.menu_var_obj.var_id)
          ) {
            order.menu_var_obj.var_choice_grp.map((choiceGrp: any) => {
              if (choiceGrp.choices.length > 0) {
                choiceGrp.choices.map((choice: any) => {
                  choiceIds.push(parseInt(choice.choice_id));
                });
              }
              if (choiceIds.length > 0) {
                progOrder.menu_var_obj.var_choice_grp.map((val: any) => {
                  if (val.choices.length > 0) {
                    val.choices.map((proChoice: any) => {
                      let da = progChoiceIds.includes(proChoice.choice_id);
                      if (da !== true) {
                        progChoiceIds.push(parseInt(proChoice.choice_id));
                      }
                    });
                  }
                });
              }
            });
            let match = this.compareArrays(choiceIds, progChoiceIds);
            if (match === true) {
              order.quantity = parseInt(order.quantity) + 1;
              incQyt = true;
            }
          } else {
            order.menu_var_obj.var_choice_grp.map((choiceGrp: any) => {
              if (choiceGrp.choices.length > 0) {
                choiceGrp.choices.map((choice: any) => {
                  choiceIds.push(parseInt(choice.choice_id));
                });
              }
              if (choiceIds.length > 0) {
                progOrder.menu_var_obj.var_choice_grp.map((val: any) => {
                  if (val.choices.length > 0) {
                    val.choices.map((proChoice: any) => {
                      let da = progChoiceIds.includes(proChoice.choice_id);
                      if (da !== true) {
                        progChoiceIds.push(parseInt(proChoice.choice_id));
                      }
                    });
                  }
                });
              }
            });
            let match = this.compareArrays(choiceIds, progChoiceIds);
            if (match === true) {
              order.quantity = parseInt(order.quantity) + 1;
              incQyt = true;
            }
          }
        } else {
          if (
            parseInt(order.menu_variation_id) ===
            parseInt(progOrder.menu_var_obj.var_id)
          ) {
            order.quantity = parseInt(order.quantity) + 1;
            incQyt = true;
          }
        }
      }
    });

    // if order item not exist then push it menuItems array
    if (incQyt === false) {
      this.cart.push(progOrder);

      // this.orderS.newOrder(this.cart);
    }
  }

  compareArrays = (a: any, b: any) => {
    a = a.sort();
    b = b.sort();
    return JSON.stringify(a) === JSON.stringify(b);
  };

  closeModal() {
    this.modalService.dismissAll();
  }
  open() {
    this.accd.toggle('p0');
  }
}
