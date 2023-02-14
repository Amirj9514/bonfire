export class NewOrder {
  public branch_id!: String;
  public order_type_id!: string;
  public sub_total!: number;
  public total!: number;
  public user_id!: String;
  public delivery_details!: any;
  public order_detail!: any;
}

export class Delivery_details {
  public gender!: string;
  public first_name!: string;
  public town_id!: string;
  public town_block_id!: number;
  public last_name!: string;
  public email!: string;
  public mobile_no!: string;
  public address!: string;
  public instructions!: string;
  public payment_type!: string;
  public latitude!: string;
  public longitude!: string;
}

export class MenuItems {
  public order_detail_choice!: any;
  public imgUrl!: string;
  public id!: number;
  public quantity!: number;
  public price!: string;
  public menu_name!: string;
  public menu_ingridient!: string;
  public menu_original_price!: string;
  public menu_total_price!: string;
  public menu_var_obj!: any;
  public menu_variation_id!: any;
}
