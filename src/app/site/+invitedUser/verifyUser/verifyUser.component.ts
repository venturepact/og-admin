import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../shared/services/user.service';
import {LoggedInService} from '../../../shared/services/logged-in.service';
import {SubDomainService} from '../../../shared/services/subdomain.service';
import {CompanyService} from '../../../shared/services/company.service';
import {CookieService} from '../../../shared/services/cookie.service';
declare var jQuery:any;
@Component({
  selector: 'verify-user',
  templateUrl: './verifyUser.component.html',
  styleUrls: ['./verifyUser.component.css']
})
export class VerifyUserComponent  implements OnInit {
  setPasswordForm : FormGroup;
  tokenHash : string ;
  authToken : string ='access_token';
  errorMsg : string ;
  error:boolean = false;
  company:any;
  constructor(public fb: FormBuilder,public _userService: UserService,
    public _router : Router,public loggedInService: LoggedInService,
    public _companyService : CompanyService,
    public _cookieService : CookieService,
    public _subDomainService : SubDomainService,
  ) {}

  ngOnInit() {
    let link = window.location.hostname;
    this.company = link.split('.')[0];
    this.isTokenVerified();
  }

   isTokenVerified() {
     let url        = window.location.pathname;
     this.tokenHash = url.split('/')[2];
     let verification = this._userService.verfiyToken(this.tokenHash)
        .subscribe(
          (response: any) => {
            let storage = {
                'verification_id'       : response._id,
            };
            localStorage.setItem('verification', JSON.stringify(storage));
            if (response.action === 'set-password') {
                let link = window.location.pathname;
                let setNewPassword = link.split('/')[0] + '/setNewPassword';
                jQuery(location).attr('href', setNewPassword );
            }
            if (response.action === 'forget-password') {
               this._router.navigate(['/setNewPassword/forgetPassword']);
            }
            if (response.action === 'existingUser-activate') {
               this.generateToken(response.user._id);
            }
            if (response.action.split('_')[0] === 'admin-accept-user-request') {
              let action = response.action;
              this.generateToken(response.user._id,action);
            }
          },
          (error: any ) =>  {
           jQuery('#token-error').removeClass('hide');
           this.error = true;
           this.errorMsg = error.error.err_message;
           verification.unsubscribe();
          }
    );
   }

   home() {
      let link = environment.APP_DOMAIN;
      jQuery(location).attr('href', link);
   }

   generateToken(data: any, action: string = null) {
      let approval = this._userService.generateToken(data)
        .subscribe(
          (response: any) => {
              // console.log(response,'$$$$$$$$$$$$$$$$$$$');
              if(response.token) {
                response.companyList.push(this.company);
                // console.log('VERIFY USER',JSON.stringify(response));
                this._subDomainService.setCurrentCompany(response.company);
                let storage = {
                    'token'  : response.token,
                    'user'   : response.user,
                    'company_id': this.company,
                    'currentCompany': response.company.sub_domain,
                    'companyList': response.companyList
                };
                this._cookieService.createCookie('storage',JSON.stringify(storage),3);
               // if(response.user.role !== 'ADMIN'){
                  let status = {
                    cardStatus: response.subscription.currentplan.customer.card_status,
                    subsStatus: response.subscription.currentplan.subscription.status
                    };
                    this._cookieService.createCookie('status',JSON.stringify(status),3);
               // }
                this.loggedInService.login();
                if(action !== null) {
                  let user_id = action.split('_')[1];
                  let company_id = action.split('_')[2];
                  this._companyService.approveUser(user_id,company_id,'ADMIN')
                    .subscribe((res)=> {
                       let link = window.location.pathname;
                       let dashboard = link.split('/')[0]+'/dashboard';
                        jQuery(location).attr('href', dashboard );
                    },(error)=> {
                      jQuery('#token-error').removeClass('hide');
                      this.errorMsg = error.error.err_message;
                    });
                }else {
                  this.inviteUserApproval();
                }
              }
          },
          (error: any ) =>  {
           jQuery('#approval-error').removeClass('hide');
           this.errorMsg = error.error.err_message;
           approval.unsubscribe();
          }
    );
   }

   inviteUserApproval() {
      let approval = this._userService.userApproval()
                  .subscribe(
                    (response: any) => {
                      this.loggedInService.login();
                      this._userService.updatebillingStatus()
                        .subscribe((status:any)=> {
                          this._cookieService.createCookie('filepicker_token_json',JSON.stringify(status),3);
                          let link = window.location.pathname;
                          let dashboard = link.split('/')[0]+'/dashboard';
                          jQuery(location).attr('href', dashboard );
                        });
                    },
                    (error: any ) =>  {
                      jQuery('#approval-error').removeClass('hide');
                      this.errorMsg = error.error.err_message;
                      approval.unsubscribe();
                    }
              );
   }
}
