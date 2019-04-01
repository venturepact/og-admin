import {Leads} from './../models/leads';
import {Traffic} from './../models/traffic';
import {UsersCompany} from './userCompany';

export class Company {
  public _id: String;
  public id: String;
  public updatedAt: Date;
  public createdAt: Date;
  public name: String;
  public sub_domain: String;
  public agency: Boolean;
  public leads: Leads;
  public current_limit: any;
  public traffic: Traffic;
  public referral: Referral;
  public user_company: UsersCompany;
  public current_referral_program: String;

  public subscription_updated: Date;
  public promocode: String;
  public is_admin_created: Boolean;
  public integration: Boolean;
  public api: String;
  public reset_current_usage: Boolean;
  public reset_period: Number;
  public is_appsumo_created: Boolean;
  public billing: Billing;
  public addon: Addon;
  public current_usage: CurrentUsage;
  public parent_company: String;
  public cname: CName;
  public remove_leads_after_saving: boolean;
  public remove_Questions_after_saving: boolean;
  public remove_analytics_after_saving: boolean;



  constructor(company: any) {
    if (company) {
      this.id = company._id;
      this.updatedAt = company.updatedAt;
      this.createdAt = company.createdAt;
      this.name = company.name;
      this.sub_domain = company.sub_domain;
      this.agency = company.agency;
      this.current_limit = company.current_limit;
      this.leads = new Leads(company.leads);
      this.traffic = new Traffic(company.traffic);
      this.user_company = new UsersCompany(company.user_company);
      this.current_referral_program = company.current_referral_program;
      this.referral = new Referral(company.referalcandy);

      this.subscription_updated = company.subscription_updated;
      this.promocode = company.promocode;
      this.is_admin_created = company.is_appsumo_created;
      this.reset_current_usage = company.reset_current_usage;
      this.reset_period = company.reset_period;
      this.is_appsumo_created = company.is_appsumo_created;
      this.addon = new Addon(company.addon);
      this.current_usage = new CurrentUsage(company.current_usage);
      this.parent_company = company.parent_company;
      this.cname = new CName(company.cname);
      this.remove_leads_after_saving = company.remove_leads_after_saving
      this.remove_Questions_after_saving = company.remove_Questions_after_saving;
      this.remove_analytics_after_saving = company.remove_analytics_after_saving;
    }
  }
}

export class AdminCompany {
  public _id: String;
  public id: String;
  public updatedAt: Date;
  public createdAt: Date;
  public name: String;
  public sub_domain: String;
  public root_url: String;
  public error_url: String;
  public agency: Boolean;
  public leads: Leads;
  public traffic: Traffic;
  public user_company: UsersCompany;
  public chargebee_plan_id: String;
  public chargebee_subscription_id: String;
  public chargebee_customer_id: String;
  public stripe_customer_id: String;
  public is_admin_created: Boolean;
  public current_limit_leads: Number = null;
  public current_limit_traffic: Number = null;
  public current_limit_calculators: Number = null;
  public current_limit_users: Number = null;
  public current_limit_companies: Number = null;
  public current_usage_leads: Number = null;
  public current_usage_traffic: Number = null;
  public addon_leads: Number;
  public addon_traffic: Number;
  public addon_quantity: Number;
  public integration: Boolean;
  public current_referral_program: String;
  public api: String;
  public reset_current_usage: Boolean;
  public isAppSumo: Boolean;
  public deal_refered: String;
  public referral: Referral;
  public reset_period: Number;
  public parent_company: String;
  public cname: CName;
  public child_intercom_id: String;
  public remove_leads_after_saving: boolean;
  public remove_Questions_after_saving: boolean;
  public remove_analytics_after_saving: boolean;

  public GDPR:boolean;
  public subscription_updated: Date;
  // public leaddyno_url : String;
  // public referralcandy_url : String;
  public can_use_default_password : boolean;
  public two_fact_auth_activation : boolean;
  public is_okta_enabled : boolean;

  constructor(company: any) {
    if (company) {
      this.id = company._id;
      this.updatedAt = company.updatedAt;
      this.createdAt = company.createdAt;
      this.name = company.name;
      this.sub_domain = company.sub_domain;
      this.agency = company.agency;
      this.leads = new Leads(company.leads);
      this.traffic = new Traffic(company.traffic);
      this.user_company = new UsersCompany(company.user_company);
      this.chargebee_customer_id = company.billing.chargebee_customer_id;
      this.chargebee_plan_id = company.billing.chargebee_plan_id;
      this.chargebee_subscription_id = company.billing.chargebee_subscription_id;
      this.subscription_updated = company.subscription_updated;
      this.stripe_customer_id = company.billing.stripe_customer_id;
      this.is_admin_created = company.is_admin_created;
      this.current_limit_leads = company.current_limit.leads;
      this.current_limit_traffic = company.current_limit.traffic;
      this.current_limit_calculators = company.current_limit.calculators;
      this.current_limit_users = company.current_limit.users;
      this.current_limit_companies = company.current_limit.companies;
      this.current_usage_leads = company.current_usage.leads;
      this.current_usage_traffic = company.current_usage.traffic;
      this.addon_leads = company.addon.leads;
      this.addon_traffic = company.addon.traffic;
      this.addon_quantity = company.addon.quantity;
      this.integration = company.integration ? company.integration : false;
      this.api = company.api;
      this.reset_current_usage = company.reset_current_usage ? company.reset_current_usage : false;
      this.reset_period = company.reset_period;
      this.isAppSumo = company.is_appsumo_created;
      this.deal_refered = company.deal_refered;
      this.current_referral_program = company.current_referral_program;
      this.referral = new Referral(company.referral);
      this.parent_company = company.parent_company;
      this.cname = new CName(company.cname);
      this.child_intercom_id = company.child_intercom_id;
      this.remove_leads_after_saving = company.remove_leads_after_saving;
      this.remove_Questions_after_saving = company.remove_Questions_after_saving;
      this.remove_analytics_after_saving = company.remove_analytics_after_saving;

      this.GDPR=company['GDPR'];
      //this.referralcandy_url = company.referral.referralcandy_url;
      //this.leaddyno_url = company.referral.leaddyno_url;
      this.can_use_default_password = company.can_use_default_password;
      this.two_fact_auth_activation = company.two_fact_auth.activation;
      this.is_okta_enabled = company.isOktaEnabled;
    }
  }
}

export class Referral {
  public is_created: Boolean;
  public referral_email: String;
  public referralcandy_url: String;
  public leaddyno_url: String;
  public referral_code: String;
  public sharing_url: String;
  public is_referralcandy_visible: Boolean;
  public growsumo_url: string;

  constructor(referral: any) {
    if (referral) {
      this.is_created = referral.is_created;
      this.referral_email = referral.referral_email;
      this.referralcandy_url = referral.referralcandy_url;
      this.leaddyno_url = referral.leaddyno_url;
      this.sharing_url = referral.sharing_url;
      this.referral_code = referral.referral_code;
      this.growsumo_url = referral.growsumo_url;
      this.is_referralcandy_visible = referral.is_referralcandy_visible;
    }
  }
}

export class CurrentCompany {
  public _id: String;
  public id: String;
  public updatedAt: Date;
  public createdAt: Date;
  public subscription_updated: Date;
  public promocode: String;
  public name: String;
  public sub_domain: String;
  public agency: Boolean;
  public leads: Leads;
  public traffic: Traffic;
  // public user_company: UsersCompany;
  public is_admin_created: Boolean;
  public integration: Boolean;
  public current_referral_program: String;
  public api: String;
  public reset_current_usage: Boolean;
  public reset_period: Number;
  public is_appsumo_created: Boolean;
  public referral: Referral;
  public billing: Billing;
  public addon: Addon;
  public current_usage: CurrentUsage;
  public current_limit: CurrentLimit;
  public parent_company: String;
  public cname: CName;

  constructor(company: any) {
    if (company) {
      this.id = company._id;
      this.updatedAt = company.updatedAt;
      this.createdAt = company.createdAt;
      this.subscription_updated = company.subscription_updated;
      this.promocode = company.promocode;
      this.name = company.name;
      this.sub_domain = company.sub_domain;
      this.agency = company.agency;
      this.leads = new Leads(company.leads);
      this.traffic = new Traffic(company.traffic);
      // this.user_company = new UsersCompany(company.user_company);
      this.is_admin_created = company.is_admin_created;
      this.integration = company.integration ? company.integration : false;
      this.api = company.api;
      this.reset_current_usage = company.reset_current_usage ? company.reset_current_usage : false;
      this.is_appsumo_created = company.is_appsumo_created;
      this.reset_period = company.reset_period;
      this.current_referral_program = company.current_referral_program;
      this.referral = new Referral(company.referral);
      this.billing = new Billing(company.billing);
      this.addon = new Addon(company.addon);
      this.current_usage = new CurrentUsage(company.current_usage);
      this.current_limit = new CurrentLimit(company.current_limit);
      this.parent_company = company.parent_company;
      this.cname = new CName(company.cname);
    }
  }
}

export class Billing {
  public user: Boolean;
  public configured: String;
  public chargebee_plan_id: String;
  public chargebee_subscription_id: String;
  public stripe_customer_id: String;
  public chargebee_customer_id: String;

  constructor(billing: any) {
    if (billing) {
      this.user = billing.user;
      this.configured = billing.configured;
      this.chargebee_plan_id = billing.chargebee_plan_id;
      this.chargebee_subscription_id = billing.chargebee_subscription_id;
      this.stripe_customer_id = billing.stripe_customer_id;
      this.chargebee_customer_id = billing.chargebee_customer_id;
    }
  }
}

export class Addon {
  public quantity: any;
  public traffic: any;
  public leads: any;

  constructor(addon: any) {
    if (addon) {
      this.quantity = addon.quantity;
      this.traffic = addon.traffic;
      this.leads = addon.leads;
    }
  }
}

export class CurrentUsage {
  public traffic: any;
  public leads: any;

  constructor(current_usage: any) {
    if (current_usage) {
      this.traffic = current_usage.traffic;
      this.leads = current_usage.leads;
    }
  }
}

export class CurrentLimit {
  public calculators: any;
  public traffic: any;
  public leads: any;
  public users: any;
  public companies: any;

  constructor(current_limit: any) {
    if (current_limit) {
      this.calculators = current_limit.calculators;
      this.traffic = current_limit.traffic;
      this.leads = current_limit.leads;
      this.users = current_limit.users;
      this.companies = current_limit.companies;
    }
  }
}

export class CName {
  public url: String;
  public root_url: String;
  public error_url: String;

  constructor(cname: any) {
    if (cname) {
      this.url = cname.url;
      this.root_url = cname.root_url;
      this.error_url = cname.error_url;
    }
  }
}


