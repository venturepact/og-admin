import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {BaseService} from './base.service';
import {UserBilling} from './../models/userBilling';
import {Estimate} from './../models/estimate';
import {Plans} from './../models/plans';
import {Addon} from './../models/addons';
import {SubDomainService} from "./subdomain.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class MembershipService extends BaseService {
  domainUrl: string = environment.APP_EXTENSION;

  constructor(public _http: Http, public _subDomainService: SubDomainService) {
    super();
  }

  getPaymentDetails(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/customer/' + company + '/card';
    return this._http.get(getPlanUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBillingAddress(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/customer/' + company;
    return this._http.get(getPlanUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPlans() {
    let getPlanUrl = this._url + '/plans';
    return this._http.get(getPlanUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setupCustomerPayment(data: any): Observable<UserBilling> {
    let company = this._subDomainService.subDomain.company_id;
    let details = {
      'card': {
        'number': data.cardNumber,
        'exp_month': data.cardMonth,
        'exp_year': data.cardYear,
        'cvv': data.cvv,
      }
    };
    return this._http.post(this._url + '/customer/' + company + '/cards', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  resetPayment(data: any): Observable<UserBilling> {
    let company = this._subDomainService.subDomain.company_id;
    let details = {
      'card': {
        'number': data.cardNumber,
        'exp_month': data.cardMonth,
        'exp_year': data.cardYear,
        'cvv': data.cvv,
      }
    };
    return this._http.put(this._url + '/customer/' + company + '/cards', details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  cancelMembership(reasons?: string): Observable<UserBilling> {
    let details = {reasons};
    let company_id = this._subDomainService.subDomain.company_id;
    return this._http.put(this._url + '/subscriptions/' + company_id, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  cancelForcefully(): Observable<any> {
    let details = {};
    let company_id = this._subDomainService.subDomain.company_id;
    return this._http.put(this._url + '/subscriptions/cancel/' + company_id, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  setupBilling(data: any): Observable<UserBilling> {
    let company = this._subDomainService.subDomain.company_id;
    let details = {
      'billing': {
        'name': data.inputName,
        'line1': data.inputAddress,
        'city': data.inputCity,
        'state': data.inputState,
        'zip': data.inputZipCode,
        'country': data.inputCountry
      }
    };
    return this._http.put(this._url + '/customer/' + company + '/billing', details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  planSubscription(plan_id: any): Observable<UserBilling> {
    let company_id = this._subDomainService.subDomain.company_id;
    let details = {
      'company_id': company_id,
      'plan_id': plan_id
    };
    return this._http.post(this._url + '/subscriptions', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getplanSubscription(id: string = null): Observable<UserBilling> {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/subscriptions/' + company;
    return this._http.post(getPlanUrl, {}, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }


  updateSubscription(data: any): Observable<UserBilling> {
    let company = this._subDomainService.subDomain.company_id;
    let user = JSON.parse(this.readCookie('storage')).user;
    data['billing']['user'] = user._id;
    let url = this._url + '/subscription/update/' + company;
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateAddon(data: any, companyId?: any) {
    let company = companyId ? companyId : this._subDomainService.subDomain.company_id;
    let url = this._url + '/subscription/updateAddon/' + company;
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getInvoices(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/invoices/' + company;
    return this._http.get(getPlanUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);

  }

  getInvoicesPdf(data: any, id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/invoices/' + company + '/pdf/' + data;
    return this._http.get(getPlanUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);

  }

  getAddonEstimate(data: any): Observable<Estimate> {
    //console.log('data addon estimate service',data);
    let company = this._subDomainService.subDomain.company_id;
    let getUrl = this._url + '/estimate/updateAddon/' + company;
    return this._http.post(getUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUpdateEstimate(data: any): Observable<Estimate> {
    // console.log("getUpdateEstimate",data);
    let company = this._subDomainService.subDomain.company_id;
    let getUrl = this._url + '/estimate/update/' + company;
    return this._http.post(getUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);

  }

  getPlanById(plan_id: any): Observable<Plans> {
    let getUrl = this._url + '/plans/' + plan_id;
    return this._http.get(getUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPlanList() {
    let getUrl = this._url + '/plan/list';
    return this._http.get(getUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAddons(): Observable<Addon> {
    let getUrl = this._url + '/addons';
    return this._http.get(getUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  activateNow() {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/subscriptions/reactivate/' + company;
    let data = '';
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCustomer(data: any): Observable<UserBilling> {
    let company = this._subDomainService.subDomain.company_id;
    let details = {
      'first_name': data,
    };
    return this._http.put(this._url + '/customer/' + company + '/updateCustomer', details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  activatePlan() {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/subscriptions/activatenow/' + company;
    let data = '';
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeCoupon() {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/subscriptions/removeCoupon/' + company;
    let data = '';
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyFeatures() {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/company/features/' + company;
    return this._http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCustomer() {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/customer/' + company;
    return this._http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addPromoCredit(data) {
    let company = this._subDomainService.subDomain.company_id;
    let url = this._url + '/customer/' + company + '/promocredit';
    return this._http.put(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
