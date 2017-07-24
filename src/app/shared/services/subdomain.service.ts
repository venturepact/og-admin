import { Injectable } from '@angular/core';
import { SubDomain } from './../interfaces/subdomain.interface';
import { CompanyService } from './company.service';
import { BaseService } from './base.service';
import { environment } from './../../../environments/environment';
import { CurrentCompany } from './../models/company';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SubDomainService extends BaseService{
  subDomain: SubDomain = {
    exists: false,
    is_sub_domain_url: false,
    sub_domain: '',
    company_id: '',
    user_id: '',
    name:''
  };
  currentCompany: CurrentCompany;
  constructor(
    public _companyService: CompanyService
  ) {
    super();
    this.subDomain.exists = false;
    let url = window.location.hostname;
    this.subDomain.is_sub_domain_url = this.checkSubDomain(url);

    if (this.subDomain.is_sub_domain_url) {
      this.subDomain.sub_domain = url.split('.')[0];
    }

  }

  setCurrentCompany(company: any){
    let cookie = this.readCookie('storage');
    this.currentCompany = new CurrentCompany(company);
    if(cookie!= null){
      let storage = JSON.parse(cookie);
      if( typeof storage.companyList !== 'undefined' && storage.companyList.indexOf(this.currentCompany.sub_domain) > 0){
        storage.currentCompany = this.currentCompany.sub_domain;
        this.createCookie('storage',JSON.stringify(storage),3);
      }
      storage = null;
      cookie = null;
    }
  }

  subDomainExists():Promise<any> {
    if (this.subDomain.is_sub_domain_url ) {
      var promise = this._companyService.isSubDomainExist(this.subDomain.sub_domain).toPromise()
      promise.then((result: any) => {
            this.setCurrentCompany(result);
            // console.log('subDomainExists CURRENT COMPANY SUBDOMAIN', this.currentCompany);
            // localStorage.setItem('lodashAuthToken', JSON.stringify(result));
            this.subDomain.exists = true;
            this.subDomain.company_id = result._id;
            this.subDomain.name = result.name;

            // localStorage.setItem('company', result._id);
            if (this.readCookie('storage')) {
              let storage = JSON.parse(this.readCookie('storage'));
              this.subDomain.user_id = storage.user._id;
              // this.checkCompanyMembership();
            }
          })
          .catch((err) => {
            if (err.error.code === 'E_COMPANY_NOT_FOUND') {
              let url = window.location.href;
              let routeObject = url.split('/');
              if(routeObject[3] !== 'Error')
                window.location.href = window.location.origin+'/Error';
              if(this.readCookie('storage')){
                let sub_domain = this.readCookie('currentCompany');
                if(sub_domain === this.subDomain.sub_domain){
                  this.createCookie('storage','',-1);
                }else{
                  let storage= this.readCookie('storage');
                  storage = JSON.parse(storage);
                  this.redirectToFirstCompany(storage);
                }

              }else{
                let url = environment.PROTOCOL+'app.' + environment.APP_EXTENSION + '/login';
                window.location.href =  url;
              }
            }
          }
        );
    }
    return promise;
  }



  checkCompanyMembership(){
    this._companyService.isCompanyMember(this.subDomain.company_id, this.subDomain.user_id)
      .subscribe(
        (data: any) => {},
        (response: any) => {
          localStorage.setItem('hasAccess','false');
        }
      );
  }

  checkSubDomain(url: String) {
    // trim spaces

    url = url.replace(/^\s+/, '');
    url = url.replace(/\s+$/, '');

    // convert back slash to forward slash
    url = url.replace(/\\/g, '/');

    // remove 'http://', 'https://' or 'ftp://'
    url = url.replace(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i, '');

    // remove 'www.' if exist
    url = url.replace(/^www\./i, '');
    if (url.split('.').length >= 3 && url.split('.')[0] === 'app' || ['outgrow', 'rely', 'inquirer', 'venturepact'].indexOf(url.split('.')[1]) === -1)
      return false;

    // remove path after domain
    url = url.replace(/\/(.*)/, '');

    // remove tld's
    if (url.match(/\.[a-z]{2,3}\.[a-z]{2}$/i)) {
      url = url.replace(/\.[a-z]{2,3}\.[a-z]{2}$/i, '');
    } else if (url.match(/\.[a-z]{2,5}$/i)) {
      url = url.replace(/\.[a-z]{2,5}$/i, '');
    }

    return (url.match(/\./g)) ? true : false;
  }

  redirectToDashboard(storage: any) {
    // console.log("10");
    // let companyAccess = JSON.parse(this.readCookie('filepicker_token_json'));
    let url = '';
    // companyAccess.forEach((e: any) => {
    //   console.log("10",e.key);
    //   if (e.key === this.subDomain.sub_domain) {
    //     url = this.subDomain.sub_domain + '.' + environment.APP_EXTENSION + '/dashboard';
    //   }
    // });
    let sub_domain = storage.currentCompany;
    if (url == '')
      url = sub_domain + '.' + environment.APP_EXTENSION + '/dashboard';
    let isException = this.exceptionRoutes();
    if (isException){
      return;
    }
    window.location.href = environment.PROTOCOL + url;
  }

  redirectToFirstCompany(storage: any) {
    let sub_domain = storage.currentCompany;
    let url = sub_domain + '.' + environment.APP_EXTENSION + '/dashboard';
    let isException = this.exceptionRoutes();
    if (isException) {
      // console.log("2a");
      return;
    }
    // console.log("3a",environment.PROTOCOL + url);
    window.location.href = environment.PROTOCOL + url;
    // console.log("4a");
  }

  exceptionRoutes() {
    let url = window.location.pathname;
    if( url === '/authorize/salesforce') {
      return true;
    }
    if( url === '/authorize/aweber') {
      return true;
    }
    if( url === '/authorize/slack') {

      return true;
    }
    return false;
  }
}

