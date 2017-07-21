declare var moment:any;

export class Estimate{
	created_at: number;
	object: string;
	subscription_estimate: SubscriptionEstimate;
	invoice_estimate: InvoiceEstimate;
	next_invoice_estimate: InvoiceEstimate;
	credit_note_estimates: CreditNoteEstimate[];
	constructor(estimate: any){
		if(estimate){
			this.created_at = moment.unix(estimate.create_at).format('DD-MM-YYYY');
			this.object = estimate.object;
			this.subscription_estimate = new SubscriptionEstimate(estimate.subscription_estimate);
			if(estimate.invoice_estimate){
				this.invoice_estimate = new InvoiceEstimate(estimate.invoice_estimate);
				estimate.next_invoice_estimate = null;
			}
			else if(estimate.next_invoice_estimate){
				this.next_invoice_estimate = new InvoiceEstimate(estimate.next_invoice_estimate);
				estimate.invoice_estimate = null;
			}
			this.credit_note_estimates = [];
			for(var i = 0; i < estimate.credit_note_estimates.length;i++){
				this.credit_note_estimates[i] = new CreditNoteEstimate(estimate.credit_note_estimates[i]);
			}
		}
	}
}

export class SubscriptionEstimate{
	id: string;
	status: string;
	next_billing_at: number;
	object: string;
	currency_code: string;
	constructor(subscriptionEstimate: any){
		if(subscriptionEstimate){
			this.id = subscriptionEstimate.id;
			this.status = subscriptionEstimate.status;
			this.next_billing_at = moment.unix(subscriptionEstimate.next_billing_at).format('DD-MM-YYYY');
			this.object = subscriptionEstimate.object;
			this.currency_code = subscriptionEstimate.currency_code;
		}
	}	
}
export class InvoiceEstimate{
	recurring: boolean;
	price_type: string;
	sub_total: number;
	total: number;
	credits_applied: number;
	amount_paid: number;
	amount_due: number;
	object: string;
	line_items: LineItems[];
	discounts: Discount[];
	taxes: Object[];
	line_item_taxes: Object[];
	currency_code: string;
	constructor(invoiceEstimate: any){
		if(invoiceEstimate){
			this.recurring = invoiceEstimate.recurring;
			this.price_type = invoiceEstimate.price_type;
			this.sub_total = invoiceEstimate.sub_total/100;
			this.total = invoiceEstimate.total/100;
			this.credits_applied = invoiceEstimate.credits_applied/100;
			this.amount_paid = invoiceEstimate.amount_paid/100;
			this.amount_due = invoiceEstimate.amount_due/100;
			this.object = invoiceEstimate.object;
			this.line_items = [];
			for(var i = 0; i < invoiceEstimate.line_items.length;i++){
				this.line_items[i] = new LineItems(invoiceEstimate.line_items[i]);
			}
			this.discounts = [];
			 if(this.line_items[0].discount_amount != 0){
				for(var i = 0; i < invoiceEstimate.discounts.length;i++){
					this.discounts[i] = new Discount(invoiceEstimate.discounts[i]);
				}
			 }
			this.taxes = null;
			this.line_item_taxes = null;
			this.currency_code = invoiceEstimate.currency_code;
		}
	}
}

export class LineItems{
	id: string;
	date_from: number;
	date_to: number;
	unit_amount: number;
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
			this.date_from = moment.unix(lineItems.date_from).format('DD-MM-YYYY');
			this.date_to = moment.unix(lineItems.date_to).format('DD-MM-YYYY');
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
			this.item_level_discount_amount = lineItems.item_level_discount_amount;
		}
	}
}

export class Discount{
	object: string;
	entity_type:string;
	description:string;
	amount: number;
	entity_id: string;
	constructor(discount:any){
		if(discount){
			this.object = discount.object;
			this.entity_type = discount.entity_type;
			this.description = discount.description;
			this.amount = discount.amount/100;
			this.entity_id = discount.entry_id;
		}
	}
}

export class CreditNoteEstimate{
	reference_invoice_id: number;
	type: string;
	price_type: string;
	sub_total: number;
	total: number;
	amount_allocated: number;
	amount_available: number;
	object: string;
	line_items: LineItems[];
	taxes: Object[];
	line_item_taxes: Object[];
	currency_code: string;
	constructor(creditNoteEstimate: any){
		if(creditNoteEstimate){
			this.reference_invoice_id = creditNoteEstimate.reference_invoice_id;
			this.type = creditNoteEstimate.type;
			this.price_type = creditNoteEstimate.price_type;
			this.sub_total = creditNoteEstimate.sub_total/100;
			this.total = creditNoteEstimate.total/100;
			this.amount_allocated = creditNoteEstimate.amount_allocated/100;
			this.amount_available = creditNoteEstimate.amount_available/100;
			this.object = creditNoteEstimate.object;
			this.line_items = [];
			for(var i = 0; i < creditNoteEstimate.line_items.length;i++){
				this.line_items[i] = new LineItems(creditNoteEstimate.line_items[i]);
			}
			this.taxes = null;
			this.line_item_taxes = null;
			this.currency_code = creditNoteEstimate.currency_code;
		}
	}
}