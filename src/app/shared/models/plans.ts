export class Plans{
	public id: String;
	public name: String;
	public invoice_name: String;
	public description: String;
	public price: number;
	public period: String;
	public period_unit: String;
	public trial_period: any;
	public trial_period_unit: String;
	public charge_model: String;
	public free_quantity: any;
	public status: String;
	public enabled_in_hodted_pages:Boolean;
	public enabled_in_portal:Boolean;
	public object: String;
	public taxable: Boolean;
	public currency_code: String;
	constructor(plans: any){
		if(plans){
			this.id = plans.id;
			this.name = plans.name;
			this.invoice_name = plans.invoice_name;
			this.description = plans.description;
			this.price = plans.price/100;
			this.period = plans.period;
			this.period_unit = plans.period_unit;
			this.trial_period = plans.trial_period;
			this.trial_period_unit = plans.trial_period_unit;
			this.charge_model = plans.charge_model;
			this.free_quantity = plans.free_quantity;
			this.status = plans.status;
			this.enabled_in_hodted_pages = plans.enabled_in_hodted_pages;
			this.enabled_in_portal = plans.enabled_in_portal;
			this.object = plans.object;
			this.taxable = plans.taxable;
			this.currency_code = plans.currency_code;
		}
	}
}
