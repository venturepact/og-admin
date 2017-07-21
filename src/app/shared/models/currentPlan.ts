declare var moment:any;
export class CurrentPlan{
  subscription: Subscriptions;
  customer: Customer;
  card: Card;
  constructor(currentPlan: any){
    if(currentPlan){
      this.subscription = new Subscriptions(currentPlan.subscription);
      this.customer = new Customer(currentPlan.customer);
      if(currentPlan.customer.card_status !== 'no_card')
        this.card = new Card(currentPlan.card);
    }
  }
}

export class Subscriptions{
  id: string;
  customer_id: string;
  plan_id: string;
  plan_quantity: number;
  status: string;
  trial_start: number;
  trial_end: number;
  start_date: number;
  current_term_start: number;
  current_term_end: number;
  created_at: number;
  started_at: number;
  has_scheduled_changes: boolean;
  object: string;
  currency_code: string;
  due_invoices_count: number;
  coupons: string[];
  constructor(subscription: any) {
    if(subscription){
      this.id = subscription.id;
      this.customer_id = subscription.customer_id;
      this.plan_id = subscription.plan_id;
      this.plan_quantity = subscription.plan_quantity;
      this.status = subscription.status;
      this.start_date = moment.unix(subscription.start_date).format('MMM Do YYYY');
      this.trial_start = moment.unix(subscription.trial_start).format('MMM Do YYYY');
      this.trial_end = moment.unix(subscription.trial_end).format('MMM Do YYYY');
      if(this.status != 'in_trial'){
        this.current_term_start = moment.unix(subscription.current_term_start).format('MMM Do YYYY');
        this.current_term_end = moment.unix(subscription.current_term_end).format('MMM Do YYYY');
      }
      this.created_at = moment.unix(subscription.created_at).format('MMM Do YYYY');
      this.started_at = moment.unix(subscription.started_at).format('MMM Do YYYY');
      this.has_scheduled_changes = subscription.has_scheduled_changes;
      this.object = subscription.object;
      this.currency_code = subscription.currency_code;
      this.due_invoices_count = subscription.due_invoice_count;
      if(subscription.coupons) {
        this.coupons = [];
        for (let i = 0; i < subscription.coupons.length; i++) {
          this.coupons.push(subscription.coupons[i].coupon_id);
        }
      }
    }
  }
}
export class Customer{
  id: string;
  first_name: string;
  email: string;
  company: string;
  auto_collection: string;
  allow_direct_debit: boolean;
  created_at: number;
  taxability: string;
  object: string;
  card_status: string;
  billing_address: BillingAddress;
  payment_method: PaymentMethod;
  promotional_credits: number;
  refundable_credits: number;
  excess_payments: number;
  cf_features: boolean;
  constructor(customer: any) {
    if(customer){
      this.id = customer.id;
      this.first_name = customer.first_name;
      this.email = customer.email;
      this.company = customer.company;
      this.auto_collection = customer.auto_collection;
      this.allow_direct_debit = customer.allow_direct_debit;
      this.created_at = moment.unix(customer.created_at).format('MMM Do YYYY');
      this.taxability = customer.taxability;
      this.object = customer.object;
      this.card_status = customer.card_status;
      this.billing_address = new BillingAddress(customer.billing_address);
      this.payment_method = new PaymentMethod(customer.payment_method);
      this.promotional_credits = customer.promotional_credits;
      this.refundable_credits = customer.refundable_credits;
      this.excess_payments = customer.excess_payments;
      this.cf_features = customer.cf_features;
    }
  }
}
export class PaymentMethod{
  object: string;
  type: string;
  reference_id: string;
  gateway: string;
  status: string;
  constructor(paymentMethod: any) {
    if(paymentMethod){
      this.object = paymentMethod.object;
      this.type = paymentMethod.type;
      this.reference_id = paymentMethod.reference_id;
      this.gateway = paymentMethod.gateway;
      this.status = paymentMethod.status;
    }
  }
}
export class Card{
  customer_id: string;
  status:string;
  gateway: string;
  iin: string;
  last4: number;
  card_type: string;
  expiry_month: number;
  expiry_year: number;
  object: string;
  masked_number: string;
  constructor(card: any) {
    if(card){
      this.customer_id = card.customer_id;
      this.status = card.status;
      this.gateway = card.gateway;
      this.iin = card.iin;
      this.last4 = card.last4;
      this.card_type = card.card_type;
      this.expiry_month = card.expiry_month;
      this.expiry_year = card.expiry_year;
      this.object = card.object;
      this.masked_number = card.masked_number;
    }
  }
}
export class BillingAddress{
  line1: String;
  city: String;
  state: String;
  country: String;
  zip: String;
  validation_status: String;
  object: String;
  constructor(billingAddress:any){
    if(billingAddress){
      this.line1 = billingAddress.line1;
      this.city = billingAddress.city;
      this.state = billingAddress.state;
      this.country = billingAddress.country;
      this.zip = billingAddress.zip;
      this.validation_status = billingAddress.validation_status;
      this.object = billingAddress.object;
    }
  }
}
