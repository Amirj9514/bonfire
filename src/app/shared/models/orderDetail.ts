export class NewOrder {
  public lat!: string;
  public lng!: string;
  public restaurant_branch_id!: string;
  public order_type_id!: string;
  public instructions!: string;
  public discount_amount!: number;
  public discount_per!: number;
  public tax_amount!: number;
  public tax_percent!: number;
  public tax_include!: boolean;
  public tax_on_original_amt!: number;
  public delivery_charge!: number;
  public service_charge!: number;
  public total!: number;
  public sub_total!: number;
  public amount_paid!: number;
  public amount_return!: number;
  public status_id!: string;
  public branch_table_id!: number;
  public table_no!: string;
  public num_persons!: number;
  public order_edit!: boolean;
  public login_user_id!: number;
  public order_taker_id!: number;
  public paymentLaterOrderId!: string;
  public payment_type_id!: any;
  public user_id!: string;
  public order_taker!: string;
  public delivery_details!: any;
  public menuItems!: any;
}

export class delivery_details {
  public town_id!: number;
  public town_block_id!: number;
  public date_birth!: any;
  public gender!: string;
  public first_name!: string;
  public last_name!: string;
  public addtype_id!: number;
  public email!: string;
  public mobile_no!: string;
  public Address!: string;
  public instructions!: string;
}

export class MenuItems {
  public order_detail_choice!: any;
  public imgUrl!: string;
  public menu_id!: number;
  public menu_qty!: number;
  public menu_price!: string;
  public menu_name!: string;
  public menu_ingridient!: string;
  public menu_original_price!: string;
  public menu_total_price!: string;
  public menu_var_obj!: any;
  public menu_variation_id!: any;
}
