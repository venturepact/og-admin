declare var moment:any;
export class Addon {
      public id:string;
      public name: string;
      public invoice_name: string;
      public type: string;
      public charge_type: string;
      public price: number;
      public period: number;
      public period_unit: string;
      public unit: string;
      public status: string;
      public enabled_in_portal: boolean;
      public updated_at: Date;
      public resource_version: number;
      public object: string;
      public currency_code: string;
      public taxable: boolean;
      constructor(addon:any){
            if(addon){
                  this.id = addon.id;;
                  this.name = addon.name;
                  this.invoice_name = addon.invoice_name;
                  this.type = addon.type;
                  this.charge_type = addon.charge_type;
                  this.price = addon.price/100;
                  this.period = addon.period;
                  this.period_unit = addon.period_unit;
                  this.unit = addon.unit;
                  this.status = addon.status;
                  this.enabled_in_portal = addon.enable_in_portal;
                  this.updated_at = moment.unix(addon.updated_at).format('MMM Do YYYY');
                  this.resource_version = addon.resource_version;
                  this.object = addon.object;
                  this.currency_code = addon.currency_code;
                  this.taxable = addon.taxable;
            }
      }
}