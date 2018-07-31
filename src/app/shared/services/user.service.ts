import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { environment } from './../../../environments/environment';
import { User } from './../models/user';
import { BaseService } from './base.service';
import { SubDomain } from './../interfaces/subdomain.interface';

@Injectable()
export class UserService extends BaseService {
  token: string;
  response: any;
  subDomain: SubDomain;
  constructor(
    public _http: Http
  ) {
    super();
  }

  getUser(id: number): Observable<User> {
    let getUserUrl = this._url + '/users/' + id;
    return this._http.get(getUserUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  leads(email: String): Observable<User> {
    localStorage.removeItem('storage');
    let data = {
      email: email
    };

    return this._http.post(this._url + '/leads', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  register(data: any): Observable<User> {
    localStorage.removeItem('storage');
    let details = {
      'user': {
        'emails': {
          'email': data.emails.email
        },
        'name': data.name,
        'password': data.password,
        'referralCode': data.referralCode
      },
      'company': {
        'sub_domain': data.domain,
        'name': data.companyname
      }
    };
    if (data.promoCode !== '') details['coupon'] = data.promoCode;
    if (data.affillates) details['affillates'] = data.affillates;
    return this._http.post(this._url + '/auth/signup', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  addUserFromAdmin(data: any): Observable<User> {
    let details = {
      'user': {
        'emails': {
          'email': data.useremail
        },
        'name': data.username,
        'password': data.userPassword,
        'is_admin_created': true,
      },
      'company': {
        'sub_domain': data.companySubDomain,
        'name': data.companyName,
        'is_admin_created': true
      },
      'is_admin': {
        'chargebee_customer_id': data.chargebeeId,
        'chargebee_subscription_id': data.chargebeeSubsId,
        'plan_id': data.plan
      }
    };
    return this._http.post(this._url + '/admin/signup', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }


  login(username: String, password: String, companyName: String, isOauth: boolean = false) : any {
    let data = {
      'username': username,
      'password': password,
      'sub_domain': companyName,
      'isOauth': false
    };

    return this._http.post(this._url + '/auth/login', data, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateBasicDetails(data: any, isAdmin: boolean = false): Observable<User> {
    console.log('data:', data);
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let user_id = storage.user._id;
    if (isAdmin)
      user_id = data.id;

    return this._http.put(this._url + '/users/' + user_id, data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }


  getBasicDetails(user_id: string = null): Observable<User> {
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    if (user_id === null)
      user_id = storage.user._id;

    let getBasicUrl = this._url + '/users/' + user_id;
    return this._http.get(getBasicUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllUsers(data: any) {
    let getUsersUrl = this._url + '/users';
    return this._http.post(getUsersUrl, data, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePassword(old_password: any, new_password: any): Observable<User> {
    let data = {
      'old_password': old_password,
      'new_password': new_password
    };
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    return this._http.put(this._url + '/users/password', data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateEmail(old_email: any, new_email: any, password: any): Observable<User> {
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let data = {
      'emails': {
        'old_email': old_email,
        'new_email': new_email
      },
      'password': password

    };
    //console.log('email json',data);
    return this._http.put(this._url + '/users/email', data, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout() {
    // console.log("inside user service  component");
    this.createCookie('storage', "", -1);
    this.createCookie('filepicker_token_json', "", -1);
    this.createCookie('status', "", -1);
    this.createCookie('role', "", -1);
    // console.log("cooooookkkieee",this.readCookie('storage'));
    return true;
  }

  saveDetail(data: any): Observable<User> {
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let details = {
      'company': {
        'name': data.companyname,
        'sub_domain': data.domain
      },
      'emails': {
        'old_email': storage.email,
        'new_email': data.emails.email
      },
      'username': data.first_name,
      'password': data.password
    };
    return this._http.put(this._url + '/users/' + storage.user._id, details, this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);

  }

  setNewPassword(new_password: any): Observable<User> {
    let data = {
      'password': new_password
    };
    let storage: any = localStorage.getItem('verification');
    storage = JSON.parse(storage);
    return this._http.patch(this._url + '/users/password/' + storage.verification_id, data, this.patch_options())
      .map(this.extractData)
      .catch(this.handleError);
  }


  verfiyToken(data: any): Observable<User> {
    let verifyUrl = this._url + '/auth/verify/' + data;
    return this._http.get(verifyUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);

  }

  verfiyEmail(data: any): Observable<User> {
    let verifyUrl = this._url + '/auth/verifyEmail/' + data;
    return this._http.get(verifyUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  userApproval(companyId: any = null, userId: any = null, fromadmin: any = null) {
    let userid;
    let cid;
    if (fromadmin) {
      userid = userId;
      cid = companyId;
      console.log(cid);
    } else {
      let storage: any = this.readCookie('storage');
      storage = JSON.parse(storage);
      cid = storage.company_id;
      userid = storage.user._id;
      if (companyId)
        cid = companyId;
    }


    return this._http.put(this._url + '/users/' + userid + '/companies/' + cid + '/join', this.putOptions())
      .map(this.extractData)
      .catch(this.handleError);

  }

  forgetPassword(capctha: any, email: any): Observable<User> {
    let details = {
      'response': capctha,
      'email': email.forgetemail
    };
    return this._http.post(this._url + '/users/forgetPassword', details, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);

  }

  generateToken(data: any): Observable<User> {
    let getBasicUrl = this._url + '/users/token/' + data;
    return this._http.get(getBasicUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getEmailLogs(data: any) {
    let getUsersUrl = this._url + '/emailLogs';
    return this._http.post(getUsersUrl, data, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDealLogs(data: any) {
    return this._http.post(this._url + '/admin/dealLog', data, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  resendEmail(data: any): Observable<User> {
    let verifyUrl = this._url + '/resendVerificationEmail/' + data;
    return this._http.get(verifyUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatebillingStatus() {
    let storage: any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let user_id = storage.user._id;
    return this._http.get(this._url + '/user_companies/status/' + user_id, this.get_options())
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeUserCompany(subdomain: string): Observable<User> {
    return this._http.post(this._url + '/user_companies/change_company/', { company: subdomain }, this.post_options())
      .map(this.extractData)
      .catch(this.handleError);
  }
}
