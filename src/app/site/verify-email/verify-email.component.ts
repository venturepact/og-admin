import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { UserService, LoggedInService, CookieService }  from './../../shared/services/index';
import { UserService} from './../../shared/services/user.service';
import { LoggedInService} from './../../shared/services/logged-in.service';
import { CookieService} from './../../shared/services/cookie.service';
import { CompanyService} from './../../shared/services/company.service';
import {environment} from '../../../environments/environment';
declare var jQuery:any;
@Component({
  selector: 'verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent  implements OnInit {
  setPasswordForm : FormGroup;
  tokenHash : string ;
  authToken : string ='access_token';
  errorMsg : string ;
  company:any;
  constructor(public fb: FormBuilder,public _userService: UserService,
    public _router : Router,public loggedInService: LoggedInService,
    public _companyService : CompanyService,
    public _cookieService : CookieService
  ) {}

  ngOnInit() {
    var link = window.location.hostname;
    this.company = link.split('.')[0];
    this.isTokenVerified();
    // console.log('VERRRIIIIFFFFYYYYY EEEMAILLLLL');
  }

   isTokenVerified() {
     var url        = window.location.pathname;
     this.tokenHash = url.split('/')[2];
     let verification = this._userService.verfiyEmail(this.tokenHash)
        .subscribe(
          (response: any) => {
            this.generateToken(response._id);
            // console.log('&&&&&&&&&&&&&&',response);
          },
          (error :any ) =>  {
           jQuery('#token-error').removeClass('hide');
           this.errorMsg = error.error.err_message;
           verification.unsubscribe();
          }
    );
   }

  generateToken(data:any, action:string = null) {
    let approval = this._userService.generateToken(data)
      .subscribe(
        (response: any) => {
          if(response.token) {
            response.companyList.push(this.company);
            //console.log(response.companyList);
            let storage = {
              'token'  : response.token,
              'user'   : response.user,
              'company_id': this.company,
              'company':response.company,
              'companyList': response.companyList
            };
            if(this._cookieService.readCookie('storage') !== null) {
             this._cookieService.eraseCookie('storage');
            }
            this._cookieService.createCookie('storage',JSON.stringify(storage),3);
            this._cookieService.createCookie('filepicker_token_json', JSON.stringify(response.companyAccess), 3);
            let status = {
              cardStatus: response.subscription.currentplan.customer.card_status,
              subsStatus: response.subscription.currentplan.subscription.status
              };
            this._cookieService.createCookie('status',JSON.stringify(status),3);
            this.loggedInService.login();
            // let link = window.location.pathname;
            // let dashboard = link.split('/')[0]+'/dashboard';
            // jQuery(location).attr('href', dashboard );
            this.redirectToFirstCompany(response.company);
          }
        },
        (error :any ) =>  {
          jQuery('#approval-error').removeClass('hide');
          this.errorMsg = error.error.err_message;
          approval.unsubscribe();
        }
      );
  }

  redirectToFirstCompany(company:any) {
    let url = company.sub_domain+'.'+environment.APP_EXTENSION+'/dashboard';
    jQuery(location).attr('href',environment.PROTOCOL+url);
  }

   home() {
     this._router.navigate(['/']);
   }
}
