declare var moment:any;

export class Invoice{
	id: string;
	customer_id:string;
	subscription_id:string;
	recurring:boolean;
	status:string;
	price_type:string;
	date:number;
	total:number;
	amount_paid:number;
	amount_adjusted:number;
	write_off_amount:number;
	credits_applied:number;
	amount_due:number;
	paid_at:number;
	object:string;
	first_invoice:boolean;
	currency_code:string;
	tax:number;
	line_items:Line_items[];
	sub_total:number;
	linked_payments:Linked_payments[]
	applied_credits:Applied_credits[]
	adjustment_credit_notes:Adjustment_credit_notes[]
	issued_credit_notes:Issued_credit_notes[];
	linked_orders:Linked_orders[];
	constructor(invoice:any){
		if(invoice){
			this.id = invoice.id;
			this.customer_id = invoice.customer_id;
			this.subscription_id = invoice.subscription_id;
			this.recurring = invoice.recurring;
			this.status = invoice.status;
			this.price_type = invoice.status;
			this.date = moment.unix(invoice.date).format('MMM Do YYYY');
			this.total = invoice.total/100;
			this.amount_paid = invoice.amount_paid/100;
			this.amount_adjusted = invoice.amount_adjusted;
			this.write_off_amount = invoice.write_off_amount;
			this.credits_applied = invoice.credits_applied;
			this.amount_due = invoice.amount_due/100;
			this.paid_at = moment.unix(invoice.paid_at).format('MMM Do YYYY');;
			this.object = invoice.object;
			this.first_invoice = invoice.first_invoice;
			this.currency_code = invoice.currency_code;
			this.tax = invoice.tax/100;
			this.line_items = [];
			invoice.line_items.forEach((lineItem:any)=>{
				this.line_items.push(new Line_items(lineItem));
			});
			this.sub_total = invoice.sub_total/100;
			this.linked_payments = [];
			invoice.linked_payments.forEach((linkedPayments:any)=>{
				this.linked_payments.push(new Linked_payments(linkedPayments));
			});
			this.applied_credits = [];
			invoice.applied_credits.forEach((appliedCredits:any)=>{
				this.applied_credits.push(new Applied_credits(appliedCredits));
			});
			this.adjustment_credit_notes = [];
			invoice.adjustment_credit_notes.forEach((adjustmentCreditNotes:any)=>{
				this.adjustment_credit_notes.push(new Adjustment_credit_notes(adjustmentCreditNotes));
			});
			this.issued_credit_notes = [];
			invoice.issued_credit_notes.forEach((issuedCreditNotes:any)=>{
				this.issued_credit_notes.push(new Issued_credit_notes(issuedCreditNotes));
			});
			this.linked_orders = [];
			invoice.linked_orders.forEach((linkedOrders:any)=>{
				this.linked_orders.push(new Linked_orders(linkedOrders));
			});
		}
	}
}
export class Line_items{
	id: string;
	date_from:number;
	date_to:number;
	unit_amount:number;
	quantity: number;
	is_taxed: boolean;
	tax_amount: number;
	object: string;
	amount: number;
	description: string;
	entity_type: string;
	entity_id: string;
	discount_amount: number;
	item_level_discount_amount: number;
	constructor(lineItems:any){
		if(lineItems){
			this.id = lineItems.id;
			this.date_from = moment.unix(lineItems.date_from).format('MMM Do YYYY');
			this.date_to = moment.unix(lineItems.date_to).format('MMM Do YYYY');
			this.unit_amount = lineItems.unit_amount/100;
			this.quantity = lineItems.quantity;
			this.is_taxed = lineItems.is_taxed;
			this.tax_amount = lineItems.tax_amount/100;
			this.object = lineItems.object;
			this.amount = lineItems.amount/100;
			this.description = lineItems.description;
			this.entity_type = lineItems.entity_type;
			this.entity_id = lineItems.entity_id;
			this.discount_amount = lineItems.discount_amount/100;
			this.item_level_discount_amount = lineItems.item_level_discount_amount/100;
		}
	}
}
export class Linked_payments{
	txn_id:string;
	applied_amount:number;
	applied_at:number;
	txn_status:string;
	txn_date:number;
	txn_amount:number;
	constructor(linkedpayment:any){
		if(linkedpayment){
			this.txn_id = linkedpayment.txn_id;
			this.applied_amount = linkedpayment.applied_amount/100;
			this.applied_at = moment.unix(linkedpayment.applied_at).format('MM Do YYYY');
			this.txn_status = linkedpayment.txn_status;
			this.txn_date = moment.unix(linkedpayment.txn_date).format('MM Do YYYY');;
			this.txn_amount = linkedpayment.txn_amount/100;
		}
	}
}
export class Applied_credits{
	applied_credit:string;
	constructor(appliedCredits:any){
		this.applied_credit = '';
	}
}
export class Adjustment_credit_notes{
	adjustment_credit_notes:string;
	constructor(appliedCredits:any){
		this.adjustment_credit_notes = '';
	}
}
export class Issued_credit_notes{
	issued_credit_notes:string;
	constructor(appliedCredits:any){
		this.issued_credit_notes = '';
	}
}
export class Linked_orders{
	linked_orders:string;
	constructor(appliedCredits:any){
		this.linked_orders = '';
	}
}