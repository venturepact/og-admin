import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';
import { Company } from './../models/company';
import { UsersCompany } from './../models/userCompany';
// import { CurrentCompany } from './../models/company';

import { User } from './../models/user';
@Injectable()
export class CompanyService extends BaseService {
  token: string;
  response: any;
  // currentCompany: CurrentCompany;
  constructor(public _http: Http) {
    super();
  }

  // setCurrentCompany(company: any){
  //   this.currentCompany = new CurrentCompany(company);
  // }

  isCompanyMember(company_id: String, user_id: any): Observable<UsersCompany> {
    let checkMembershipUrl = this._url + '/users_companies/companies/' + company_id + '/users/' + user_id;
    return this._http.get(checkMembershipUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getFirstCompany(user_id: any): Observable<UsersCompany> {
    let getFirstCompany = this._url + '/users_companies/users/' + user_id;
    return this._http.get(getFirstCompany, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanies(): Observable<Company> {
    let getCompaniesUrl = this._url + '/users_companies/companies';
    return this._http.get(getCompaniesUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyUsers(company_id: any): Observable<User> {
    let getBasicUrl = this._url + '/users_companies/' + company_id + '/users';
    let data = {};
    return this._http.post(getBasicUrl, data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getCompanyUsersForEmail(company_id: any): Observable<any> {
    return this._http.get(this._url + '/users_companies/' + company_id + '/users', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getUserCompanies(user_id: any) {
    let getCompaniesUrl = this._url + '/users_companies/companies/user/' + user_id;
    return this._http.get(getCompaniesUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  isCompanyExist(company: String): Observable<any> {
    let companyurl = this._url + '/companies/name/' + company;
    return this._http.get(companyurl)
      .map(this.extractData)
      .catch(this.handleError);
  }
  // isSubDomainExist (company :String) : Observable<Company> {
  //   let storage;
  //   let companyurl;
  //   if (this.readCookie('storage')) {
  //      storage = JSON.parse(this.readCookie('storage'));
  //   }
  //   if(storage){
  //     companyurl= this._url + '/companies/user/'+storage.user._id+'/sub_domain/' + company;
  //   }else{
  //     companyurl= this._url + '/companies/sub_domain/' + company;
  //   }
  //   return this._http.get(companyurl)
  //                     .map(this.extractData)
  //                     .catch(this.handleError);
  // }

  isSubDomainExist(company: String): Observable<Company> {
    let companyurl = this._url + '/companies/sub_domain/' + company;
    return this._http.get(companyurl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addUser(data: any, company_id: any): Observable<User> {
    let details = {
      'email': data.userEmail,
      'name': data.userName,
      'role': data.userRole
    };
    return this._http.post(this._url + '/users_companies/' + company_id, details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);

  }

  createCompany(data: any): Observable<Company> {
    let companyurl = this._url + '/companies';
    let details = {
      'name': data.companyname,
      'sub_domain': data.domain,
      'agency': data.agency,
      'parent_company': data.parent_company
    };
    // console.log("PARENT COMPANY",data);
    return this._http.post(companyurl, details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  searchCompany(company: String): Observable<Company> {
    let companyurl = this._url + '/companies/list/' + company;
    return this._http.get(companyurl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  joinCompany(companyId: String): Observable<UsersCompany> {
    let companyUrl = this._url + '/users_companies';
    let details = {
      'company_id': companyId
    };
    return this._http.post(companyUrl, details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  leaveCompany(compId: any): Observable<UsersCompany> {
    let getBasicUrl = this._url + '/users_companies/' + compId;
    return this._http.delete(getBasicUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  removeUser(companyId: any, userId: any): Observable<UsersCompany> {
    let getBasicUrl = this._url + '/users_companies/companies/' + companyId + '/users/' + userId;
    return this._http.delete(getBasicUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  approveUser(userId: any, companyId: any, userRole: any): Observable<UsersCompany> {
    let getBasicUrl = this._url + '/users_companies/approve';
    let admin = false;
    if (userRole === 'ADMIN')
      admin = true;
    let details = {
      'user_id': userId,
      'company_id': companyId,
      'admin': admin
    };
    return this._http.put(getBasicUrl, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  makeAdmin(companyId: any, userId: any): Observable<UsersCompany> {
    let getBasicUrl = this._url + '/users_companies/' + companyId + '/admin';
    let details = {
      'user_id': userId,
      'admin': true
    };
    return this._http.put(getBasicUrl, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  makeManager(companyId: any, userId: any): Observable<UsersCompany> {
    let getBasicUrl = this._url + '/users_companies/' + companyId + '/admin';
    let details = {
      'user_id': userId,
      'admin': false
    };
    return this._http.put(getBasicUrl, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  saveCallSchedule(data: any): Observable<Company> {
    let ls: string = localStorage.getItem('storage');
    let storage: any = JSON.parse(ls);
    let details = {
      'leads': {
        'total': data.leads
      },
      'traffic': {
        'frequency': data.traffic
      },
      'agency': data.companyType
    };
    return this._http.put(this._url + '/companies/' + storage.company._id, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCompany(compId: any, company: any, isAdmin: boolean = false): Observable<Company> {
    let companyUrl = this._url + '/companies/' + compId;
    let details: any = {};
    if (isAdmin) {
      details = {
        'name': company.name,
        'sub_domain': company.sub_domain,
        'agency': company.agency,
        'is_admin_created': company.is_admin_created,
        'billing': {
          'chargebee_plan_id': company.chargebee_plan_id,
          'chargebee_subscription_id': company.chargebee_subscription_id,
          'chargebee_customer_id': company.chargebee_customer_id,
          'stripe_customer_id': company.stripe_customer_id
        },
        'current_limit': {
          'leads': company.current_limit_leads,
          'traffic': company.current_limit_traffic
        },
        'integration': company.integration ? company.integration : false
      };
    } else {
      details = {
        'name': company.companyname,
        'sub_domain': company.domain,
        'cname': company.cname,
        'agency': company.agency
        // 'traffic':{
        //   'frequency':company.traffic
        // },
        // 'leads':{
        //   'total':company.leads
        // }
      };
    }
    return this._http.put(companyUrl, details, this.put_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  //Get Apps
  getCompanyProjects(id: String) {
    let URL = this._url + '/dashboard/company_projects/';
    return this._http.post(URL, { company: id }, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyHomeProjects(id: String) {
    let URL = this._url + '/dashboard/company_home_projects/' + id;
    return this._http.get(URL)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLiveCompanyProjects(company_id: String) {
    let URL = this._url + '/dashboard/live_projects/' + company_id;
    return this._http.get(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProjectsStats(id: String) {
    let URL = this._url + '/analytic/projects_stats/' + id;
    return this._http.get(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCompanies(data: any) {
    let getCompaniesUrl = this._url + '/companies/all';
    return this._http.post(getCompaniesUrl, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyInfo(id: number) {
    let URL = this._url + '/companies/' + id;
    return this._http.get(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);

  }

  //Get Templates
  getTemplates() {
    let getPlanUrl = this._url + '/dashboard/get_templates';
    return this._http.get(getPlanUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  generateApiKey(compId: string) {
    let details = {
      'id': compId
    };
    return this._http.post(this._url + '/apikey/create', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getHellobarMessage() {
    return this._http.get(this._url + '/selectedHellobar', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  verifyCustomDomain(data: any) {
    return this._http.post(this._url + '/verify/customdomain', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
  resendInvitation(user: any, company: any): Observable<User> {
    let verifyUrl = this._url + '/users_companies/' + company + '/resendInviteUserEmail/' + user;
    return this._http.get(verifyUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  checkCnameExist(company :any){
    let URL = this._url + '/companies/cname/'  + company;
      return this._http.get(URL, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
