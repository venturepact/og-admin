import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from './../environments/environment';
import { SubDomain } from './shared/interfaces/subdomain.interface';
import { Script } from './shared/services/script.service';
import { SubDomainService } from './shared/services/subdomain.service';
import { CookieService } from './shared/services/cookie.service';
import { CompanyService } from './shared/services/company.service';
declare var window: any;
declare var jQuery: any;
// declare var _refersion: Function;

@Component({
  selector: 'sd-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  subDomain: SubDomain;
  safeSubDomainUrl: SafeResourceUrl = '';
  subDomainUrl: string = '';
  featureSub: any;
  cookie: any;
  storage: any;
  url: any ;
  root_url :boolean;
  constructor(
    public subDomainService: SubDomainService,
    public _script: Script,
    public sanitizer: DomSanitizer,
    public _cookieService: CookieService,
    public _companyService: CompanyService
  ){
    this.subDomain = subDomainService.subDomain;


    var url = window.location.href;
    var urlParts = url.split('/');
    //calc name
    var name = urlParts[3].split('?')[0];
    if (['outgrow','rely', 'inquirer', 'venturepact'].indexOf(urlParts[2].split('.')[1]) == -1 && name ==="") {
      this.url = encodeURIComponent(urlParts[2]);
      this.checkCName(this.url);
    }

    // console.log('APP RUNS FIRST',this.subDomain,subDomainService.currentCompany);
    if (this.subDomain.is_sub_domain_url) {
      this.subDomainUrl = this.subDomain.sub_domain + '.' + environment.APP_EXTENSION;
      this.safeSubDomainUrl = sanitizer.bypassSecurityTrustResourceUrl(
        environment.PROTOCOL + this.subDomain.sub_domain + '.' + environment.APP_EXTENSION
      );
    }
  }

  ngOnInit() {
    console.log('%cSTOP!.', ' color: red; font-size: xx-large');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature, it is a scam and will give them access to your account.', 'color: grey; font-size: x-large');

    let exceptRoute: Boolean = !this.subDomainService.exceptionRoutes();
    this.cookie = this._cookieService.readCookie('storage');

    this.storage = this.cookie != null ? JSON.parse(this.cookie) : '';

    /** changes for meta tags */
    jQuery('meta[property="og:description"]').attr('content', 'venturepact');
    jQuery('meta[property="og:title"]').attr('content', 'venturepact');
    let url = window.location.href;
    let routeObject = url.split('/');
    if (routeObject[3] == 'logout')
      return true;
    if (this.cookie != null) {
      // console.log("3");
      if (!this.subDomain.is_sub_domain_url && this.storage.user.role !== 'ADMIN' && routeObject[3] !== 'verifyEmail') {
      //  this.subDomainService.redirectToFirstCompany(this.storage);
      }
      else if (this.storage.user.role === 'ADMIN' && routeObject[3] !== 'admin') {
         window.location.href = environment.PROTOCOL+environment.PARENT_APP_DOMAIN + '/admin';
      }
      else if (this.subDomain.is_sub_domain_url && !routeObject[3]) {
        // console.log("6");
        //this.subDomainService.redirectToDashboard(this.storage);
      }
    } else if (!routeObject[3] && this.subDomain.is_sub_domain_url) {
      //console.log("7");
      url = 'app.' + environment.APP_EXTENSION + '/login';
      window.location.href = environment.PROTOCOL + url;
    }
    this.setUTMRefCookie();
  }

  setUTMRefCookie() {
    let search = window.location.search;

    if ('' !== search && !this._cookieService.readCookie('utm_ref')) {
      search = search.split('?')[1];
      let utmRefCookie = {
        'ref': 'UNKNOWN',
        'utm_source': 'UNKNOWN',
        'utm_medium': 'UNKNOWN',
        'utm_campaign': 'UNKNOWN',
      };
      let queryParams = search.split('&');
      queryParams.forEach(param => {
        let key = param.split('=')[0];
        let value = param.split('=')[1];
        if ('ref' === key || 'utm_source' === key || 'utm_medium' === key || 'utm_campaign' === key)
          utmRefCookie[key] = value;
      })
      if ('UNKNOWN' === utmRefCookie.ref) {
        utmRefCookie.ref = document.referrer ? document.referrer : 'DIRECT';
      }
      this._cookieService.createCookie('utm_ref', JSON.stringify(utmRefCookie), 365);
    }
  }

  checkCName(company :any){
    let isCName  = this._companyService.checkCnameExist(company)
     .subscribe(
      (response: any) => {
        if(response.root_url){
          window.location = '//' + response.root_url ;
          this.root_url = true ;
        }else{
          this.root_url = false;
        }
      },
      (error: any) => {
        console.log(error);
      });
    }


  ngOnDestroy() {
  }
}

