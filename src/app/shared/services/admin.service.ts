import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import { User } from "./../models/user";
import { BaseService } from "./base.service";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { APIBasedServiceProvider } from "./helper-service/api-based-request";

@Injectable()
export class AdminService extends BaseService {
  public getLogSubject = new BehaviorSubject<String>("");
  public availableTemplates = [];
  public API_URL_SUBJECT = new BehaviorSubject<String>("default");

  constructor(public _http: Http) {
    super();
    this.getAvailableTemplates().subscribe(data => {
      this.availableTemplates = data;
    });
  }

  getBasicGraph(data: any) {
    let getCompaniesUrl = this._url + "/admin/graph";
    return this._http
      .post(getCompaniesUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateEmail(
    old_email: any,
    new_email: any,
    user_id: string
  ): Observable<User> {
    let storage: any = this.readCookie("storage");
    storage = JSON.parse(storage);
    let data = {
      emails: {
        old_email: old_email,
        new_email: new_email
      }
    };
    return this._http
      .put(
        this._url + "/admin/update/email/" + user_id,
        data,
        this.putOptions()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePassword(new_password: any, user_id: string): Observable<User> {
    let data = {
      new_password: new_password
    };
    return this._http
      .put(
        this._url + "/admin/update/password/" + user_id,
        data,
        this.putOptions()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCompanyAddon(data: any, company_id: String) {
    return this._http
      .put(
        this._url + "/admin/company/addon/" + company_id,
        data,
        this.putOptions()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  verifyEmail(user_id: string) {
    return this._http
      .put(this._url + "/admin/email/verify/" + user_id, {}, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  setPasswordLink(user: number) {
    return this._http
      .get(this._url + "/admin/set_pwd_link/" + user, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  generatePasswordLink(user: number) {
    return this._http
      .get(this._url + "/admin/gen_pwd_link/" + user, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEmailLogs(user: number, type: string) {
    return this._http
      .get(
        this._url + "/admin/user/emails/" + type + "/" + user,
        this.get_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSiteSettings() {
    return this._http
      .get(this._url + "/admin/site/settings/", this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateSiteSettings(data: any) {
    return this._http
      .put(this._url + "/admin/site/settings/", data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllLeads(data: any) {
    return this._http
      .post(this._url + "/admin/leads", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCompany(company: any, companyId: string) {
    let growSumoUrl = company.referral.growsumo_url;

    if (!/^(f|ht)tps?:\/\//i.test(growSumoUrl)) {
      growSumoUrl = "http://" + growSumoUrl;
    }

    let details: any = {
      name: company.name,
      sub_domain: company.sub_domain,
      cname: company.cname,
      current_referral_program: company.current_referral_program,
      agency: company.agency,
      is_admin_created: company.is_admin_created,
      billing: {
        chargebee_plan_id: company.chargebee_plan_id,
        chargebee_subscription_id: company.chargebee_subscription_id,
        chargebee_customer_id: company.chargebee_customer_id,
        stripe_customer_id: company.stripe_customer_id
      },
      integration: company.integration ? company.integration : false,
      calculators: company.current_limit_calculators,
      users: company.current_limit_users,
      companies: company.current_limit_companies,
      isAppSumo: company.isAppSumo,
      referral: {
        referralcandy_url: company.referral.referralcandy_url,
        leaddyno_url: company.referral.leaddyno_url,
        is_referralcandy_visible: company.referral.is_referralcandy_visible,
        growsumo_url: growSumoUrl
      },
      child_intercom_id: company.child_intercom_id,
      change_immediate: company.change_immediate,
      remove_leads_after_saving: company.remove_leads_after_saving,
      GDPR: company["GDPR"],
      deal_refered: company["deal_refered"]
    };
    return this._http
      .put(
        this._url + "/admin/update/company/" + companyId,
        details,
        this.putOptions()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCouponsCode(data: any) {
    return this._http
      .post(this._url + "/coupon/lists", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createPromo(data: any) {
    console.log(this.post_options(), ">>>>>>>>>>>>>>>>>>");
    return this._http
      .post(this._url + "/coupon/create", data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  deletePromocode(couponId: string) {
    return this._http
      .put(this._url + "/coupon/delete/" + couponId, {}, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  viewPromocode(couponId: string) {
    return this._http
      .get(this._url + "/coupon/show/" + couponId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  editPromocode(couponId: string, data: any) {
    return this._http
      .put(this._url + "/coupon/update/" + couponId, data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSpecialCouponCodeLogs(params: any) {
    return this._http
      .post(this._url + "/admin/special_deal_log", params, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyCouponDetails(email) {
    return this._http
      .get(this._url + "/admin/company_couponcode/" + email, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  editMessage(data: any, type: string) {
    return this._http
      .put(this._url + "/selectedHellobar/" + type, data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllFeatures() {
    return this._http
      .post(this._url + "/features/get", this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  featureUpdate(data) {
    return this._http
      .post(this._url + "/features/update", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanySuccessRate(data): any {
    return this._http
      .post(this._url + "/admin/companies/successrate/", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyAppDetails(data): any {
    return this._http
      .post(this._url + "/admin/companies/get_apps_stats", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyUserDetails(data): any {
    return this._http
      .post(this._url + "/admin/companies/getusers/", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompaniesTrialStatus(data): any {
    return this._http
      .post(
        this._url + "/admin/companies/get_companies_trialstats",
        data,
        this.options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyIntegrations(data): any {
    return this._http
      .post(this._url + "/admin/companies/get_integrations", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAppIntegrations(data): any {
    return this._http
      .post(
        this._url + "/admin/companies/get_integration_apps",
        data,
        this.options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  // @desc: For Error Logs.
  getLog(data): Observable<any> {
    let source = this.API_URL_SUBJECT.getValue();
    const url = APIBasedServiceProvider.APISwitch(source);
    return this._http
      .post(url + "/admin/getLog", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // @desc: For Frontend Logs.
  getFrontendLog(queryparams) {
    let source = this.API_URL_SUBJECT.getValue();
    const url = APIBasedServiceProvider.APISwitch(source);
    return this._http
      .get(url + "/logs/getLogs/vp@outgrow", {
        search: queryparams,
        ...this.options
      })
      .map(this.extractData)
      .catch(this.handleError);
  }

  notifylogType(type) {
    this.getLogSubject.next(type);
  }

  getlogType(): Observable<any> {
    return this.getLogSubject.asObservable();
  }

  getAppIntegrationLogs(data): any {
    return this._http
      .post(
        this._url + "/admin/companies/get_apps_integration_logs",
        data,
        this.options
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIntegrationLogDetails(data): any {
    return this._http
      .post(this._url + "/admin/getIntegrationLogDetails", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getApps(data): any {
    return this._http
      .post(this._url + "/admin/companies/getapps", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyProjects(sub_domain: String): Observable<any> {
    let URL = this._url + "/admin/company_projects/";
    return this._http
      .post(URL, { company: sub_domain }, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  exportDataToSheet(data) {
    return this._http
      .post(this._url + "/admin/exportToSheet", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteUser(user: any) {
    let URL =
      this._url +
      "/admin/remove/company/" +
      user.user_company._id +
      "/user/" +
      user._id;
    return this._http
      .delete(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addNewMember(user: any, companyId: string) {
    let data = {
      name: user.memberName,
      email: user.memberEmail,
      role: user.memberRole
    };
    let URL = this._url + "/admin/add/company/" + companyId + "/user";
    return this._http
      .post(URL, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChildCompanies(companyId: string) {
    return this._http
      .get(
        this._url + "/admin/company/" + companyId + "/child-company",
        this.get_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCustomJSApprovalsList(obj: any): Observable<any> {
    return this._http
      .post(this._url + "/admin/customJs-approvals", obj, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setScriptStatus(data: Object): Observable<any> {
    return this._http
      .post(this._url + "/admin/set-script-status", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addSubAdmin(data: any) {
    return this._http
      .post(this._url + "/admin/subadmin", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSubAdmin(data: any) {
    return this._http
      .post(this._url + "/admin/getsubadmin", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateBasicDetails(data: any, isAdmin: boolean = true): Observable<User> {
    let user_id = data.id;
    return this._http
      .put(this._url + "/users/" + user_id, data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllAdminLogs(
    company: any = null,
    data: any,
    subadminId: any = null
  ): Observable<any> {
    let uri = "";
    if (company) {
      uri = this._url + "/admin/subadminlog/" + company;
    }
    // else if(subadminId){
    //   uri = this._url + "/admin/subadminlog/"+subadminId
    //   }
    return this._http
      .post(uri, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLogById(logId: String): Observable<any> {
    return this._http
      .get(this._url + "/admin/subadminlog/" + logId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPromoCheckListItems(dataTableAttr: any): Observable<any> {
    return this._http
      .post(this._url + "/admin/promolists", dataTableAttr, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  savePromoCheckListItems(data: Object): Observable<any> {
    return this._http
      .post(this._url + "/admin/promolist", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePromoCheckListItems(id, data: Object): Observable<any> {
    return this._http
      .put(this._url + "/admin/promolist/" + id, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deletePromoCheckListItems(id): Observable<any> {
    return this._http
      .delete(this._url + "/admin/promolist/" + id)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAppPromotionScore(appId): Observable<any> {
    return this._http
      .get(this._url + "/apps/score/" + appId, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateAppsAnalytics() {
    return this._http
      .get(this._url + "/admin/updateCalcAnalytics")
      .map(this.extractData)
      .catch(this.handleError);
  }

  generateDealCoupon(data) {
    return this._http
      .post(this._url + "/webhook/deal/jvzoo", data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveSuccessRateFilter(data) {
    return this._http
      .post(
        this._url + "/admin/success_rate/save_filter",
        data,
        this.post_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSavedFilters() {
    return this._http
      .get(this._url + "/admin/success_rate/get_filters", this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWebhookEventsByCompany(companyId) {
    return this._http
      .get(
        this._url + "/admin/companies/get_events/" + companyId,
        this.get_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllIntegrationLogs(data) {
    return this._http
      .post(
        this._url + "/admin/companies/getAllIntegrationLogs",
        data,
        this.post_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getHellobar(data) {
    return this._http
      .post(this._url + "/admin/getAllHellobars", data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveHellobar(data) {
    return this._http
      .put(this._url + "/admin/saveHellobar", data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteHellobar(hellobarId) {
    return this._http
      .delete(this._url + "/admin/" + hellobarId, this.delete_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAvailableTemplates() {
    return this._http
      .get(`${this._url}/admin/getAvailableTemplates`, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveAutoLoginToken(data: Object): Observable<any> {
    return this._http
      .post(this._url + "/admin/saveAutoLoginToken", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeAutoLoginToken(data: Object): Observable<any> {
    return this._http
      .put(this._url + "/admin/removeAutoLoginToken", data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCustomFeatures(data) {
    return this._http
      .post(
        `${this._url}/admin/update/custom_feature`,
        data,
        this.post_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  searchCompany(sub_domain) {
    return this._http
      .get(
        `${this._url}/admin/getCompanyBySubdomain/${sub_domain}`,
        this.get_options()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  duplicateApp(data) {
    return this._http
      .post(`${this._url}/admin/duplicateApp`, data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateTeam(data) {
    let users = [];
    let userCompanies = [];

    data.forEach(d => {
      let userCompany = {};
      let user = {};

      user["name"] = d["name"];
      user["_id"] = d["_id"];
      users.push(user);

      userCompany["_id"] = d.user_company._id;
      userCompany["role"] = d.user_company.role;
      userCompany["status"] = d.user_company.status;
      userCompany["active"] = d.user_company.active;
      userCompanies.push(userCompany);
    });

    return this._http
      .put(
        `${this._url}/admin/updateTeam`,
        { users, userCompanies },
        this.putOptions()
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  uploadGif(file) {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);

    const headers = new Headers();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    console.log(formData, "><><><", headers);
    return this._http
      .post(`${this._url}/admin/uploadGif`, formData, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompUsageCycle(id) {
    return this._http
      .get(`${this._url}/admin/getcompanyUsageCycle/${id}`, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  showCacheKey(source_api = "default", data: any): Observable<any> {
    // console.log("::In Cache Key fxn::")
    const _url = APIBasedServiceProvider.APISwitch(source_api);
    return this._http
      .post(`${_url}/cache/index`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  clearCache(id:any){
    // let urls = []
    //   urls.push(id)
    //   console.log(urls)
    return this._http.delete(`${this._url}/cache/clear/`,{body:{urls:id}})
      .map(this.extractData)
  }
  getAppsCreatedByPremade(url){
    return this._http.get(`${this._url}/admin/getAppsCreatedByPremade/${url}`,this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeNCbP(id, ncbp) {
    return this._http.put(`${this._url}/admin/updateNCbP/${id}`, {cf_non_cb_payments: ncbp}, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPremadesDateWise(selectedDate){
    return this._http.post(`${this._url}/admin/getPremadeDateWise`,selectedDate,this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
}
