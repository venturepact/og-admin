import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import {User} from "./../models/user";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {BaseService} from "./base.service";

@Injectable()
export class AdminService extends BaseService {
  constructor(public _http: Http) {
    super();
  }

  public getLogSubject = new ReplaySubject<String>(2);

  getBasicGraph(data: any) {
    let getCompaniesUrl = this._url + '/admin/graph';
    return this._http.post(getCompaniesUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  updateEmail(old_email: any, new_email: any, user_id: string): Observable<User> {
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let data = {
      'emails': {
        'old_email': old_email,
        'new_email': new_email
      }
    };
    return this._http.put(this._url + '/admin/update/email/' + user_id, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePassword(new_password: any, user_id: string): Observable<User> {
    let data = {
      'new_password': new_password
    };
    return this._http.put(this._url + '/admin/update/password/' + user_id, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCompanyAddon(data: any, company_id: String) {
    return this._http.put(this._url + '/admin/company/addon/' + company_id, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyEmail(user_id: string) {
    return this._http.put(this._url + '/admin/email/verify/' + user_id, {}, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  setPasswordLink(user: number) {
    return this._http.get(this._url + '/admin/set_pwd_link/' + user, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  generatePasswordLink(user: number) {
    return this._http.get(this._url + '/admin/gen_pwd_link/' + user, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEmailLogs(user: number, type: string) {
    return this._http.get(this._url + '/admin/user/emails/' + type + '/' + user, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSiteSettings() {
    return this._http.get(this._url + '/admin/site/settings/', this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateSiteSettings(data: any) {
    return this._http.put(this._url + '/admin/site/settings/', data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllLeads(data: any) {
    return this._http.post(this._url + '/admin/leads', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCompany(company: any, companyId: string) {
    let details: any = {};
    details = {
      'name': company.name,
      'sub_domain': company.sub_domain,
      'cname': company.cname,
      'current_referral_program': company.current_referral_program,
      'agency': company.agency,
      'is_admin_created': company.is_admin_created,
      'billing': {
        'chargebee_plan_id': company.chargebee_plan_id,
        'chargebee_subscription_id': company.chargebee_subscription_id,
        'chargebee_customer_id': company.chargebee_customer_id,
        'stripe_customer_id': company.stripe_customer_id
      },
      'integration': company.integration ? company.integration : false,
      'calculators': company.current_limit_calculators,
      'users': company.current_limit_users,
      'companies': company.current_limit_companies,
      'isAppSumo': company.isAppSumo,
      'referral': {
        'referralcandy_url': company.referral.referralcandy_url,
        'leaddyno_url': company.referral.leaddyno_url,
        'is_referralcandy_visible': company.referral.is_referralcandy_visible
      },
    };
    return this._http.put(this._url + '/admin/update/company/' + companyId, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }


  getCouponsCode(data: any) {
    return this._http.post(this._url + '/coupon/lists', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createPromo(data: any) {
    console.log(this.post_options(), ">>>>>>>>>>>>>>>>>>");
    return this._http.post(this._url + '/coupon/create', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  deletePromocode(couponId: string) {
    return this._http.put(this._url + '/coupon/delete/' + couponId, {}, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  viewPromocode(couponId: string) {
    return this._http.get(this._url + '/coupon/show/' + couponId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  editPromocode(couponId: string, data: any) {
    return this._http.put(this._url + '/coupon/update/' + couponId, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSpecialCouponCodeLogs(params: any) {
    return this._http.post(this._url + '/admin/special_deal_log', params, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyCouponDetails(email) {
    return this._http.get(this._url + '/admin/company_couponcode/' + email, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  editMessage(data: any, type: string) {
    return this._http.put(this._url + '/hellobar/' + type, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllFeatures() {
    return this._http.post(this._url + '/features/get', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  featureUpdate(data) {
    return this._http.post(this._url + '/features/update', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanySuccessRate(data): any {
    return this._http.post(this._url + '/admin/companies/successrate/', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyAppDetails(data): any {
    return this._http.post(this._url + '/admin/companies/get_apps_stats', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyUserDetails(data): any {
    return this._http.post(this._url + '/admin/companies/getusers/', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompaniesTrialStatus(data): any {
    return this._http.post(this._url + '/admin/companies/get_companies_trialstats', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUserDetailsFromIntercom(data): any {
    return this._http.post(this._url + '/admin/get_user_from_intercom', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyIntegrations(data): any {
    return this._http.post(this._url + '/admin/companies/get_integrations', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAppIntegrations(data): any {
    return this._http.post(this._url + '/admin/companies/get_integration_apps', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLog(data): Observable<any> {

    console.log("In Observable", data);
    return this._http.post(this._url + '/admin/getLog', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  notifylogType(type) {
    console.log(type);
    this.getLogSubject.next(type);
  }

  getlogType(): Observable<any> {
    return this.getLogSubject.asObservable();
  }


  getAppIntegrationLogs(data): any {
    return this._http.post(this._url + '/admin/companies/get_apps_integration_logs', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getApps(data): any {
    return this._http.post(this._url + '/admin/companies/getapps', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyProjects(sub_domain: String) {
    let URL = this._url + '/admin/company_projects/';
    return this._http.post(URL, {company: sub_domain}, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  exportDataToSheet(data) {
    return this._http.post(this._url + '/admin/exportToSheet', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteUser(user: any) {
    let URL = this._url + '/admin/remove/company/' + user.user_company._id + '/user/' + user._id;
    return this._http.delete(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addNewMember(user: any, companyId: string) {
    let data = {
      name: user.memberName,
      email: user.memberEmail,
      role: user.memberRole
    };
    let URL = this._url + '/admin/add/company/' + companyId + '/user';
    return this._http.post(URL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChildCompanies(companyId: string) {
    return this._http.get(this._url + '/admin/company/' + companyId + '/child-company', this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCustomJSApprovalsList(obj: any): Observable<any> {
    return this._http.post(this._url + '/admin/customJs-approvals', obj, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setScriptStatus(data: Object): Observable<any> {
    return this._http.post(this._url + '/admin/set-script-status', data, this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  addSubAdmin(data: any) {
    return this._http.post(this._url + '/admin/subadmin', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSubAdmin(data: any) {
    return this._http.post(this._url + '/admin/getsubadmin', data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateBasicDetails(data: any, isAdmin: boolean = true): Observable<User> {
    let user_id = data.id;
    return this._http.put(this._url + '/users/' + user_id, data, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllAdminLogs( company:any = null, data: any,subadminId: any = null,): Observable<any> {
    let uri = '';
    if(company){
      uri = this._url + "/admin/subadminlog/"+company
    }
    // else if(subadminId){
    //   uri = this._url + "/admin/subadminlog/"+subadminId
    //   }
    return this._http.post(uri, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLogById(logId: String): Observable<any> {
    return this._http.get(this._url + '/admin/subadminlog/' + logId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPromoCheckListItems(dataTableAttr: any): Observable<any> {
    return this._http.post(this._url + '/admin/promolists', dataTableAttr, this.post_options())
      .map(this.extractData)
      .catch(this.handleError)
  }

  savePromoCheckListItems(data: Object): Observable<any> {
    return this._http.post(this._url + '/admin/promolist', data, this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  updatePromoCheckListItems(id, data: Object): Observable<any> {
    return this._http.put(this._url + '/admin/promolist/' + id, data, this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  deletePromoCheckListItems(id): Observable<any> {
    return this._http.delete(this._url + '/admin/promolist/' + id)
      .map(this.extractData)
      .catch(this.handleError)
  }

  getAppPromotionScore(appId): Observable<any> {
    return this._http.get(this._url + '/apps/score/' + appId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError)
  }

  updateAppsAnalytics() {
    return this._http.get(this._url + '/admin/updateCalcAnalytics')
      .map(this.extractData)
      .catch(this.handleError);
  }

  generateDealCoupon(data){
    return this._http.post(this._url + '/webhook/deal/jvzoo', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError)
  }
}
