import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {  Router} from '@angular/router';
import {UserService} from '../../../shared/services/user.service';
import {LoggedInService} from '../../../shared/services/logged-in.service';
import {SubDomainService} from '../../../shared/services/subdomain.service';
import {CookieService} from '../../../shared/services/cookie.service';
declare var jQuery:any;

@Component({
  selector: 'set-password',
  templateUrl: './setPassword.component.html',
  styleUrls: ['./setPassword.component.css','./custom-material.css']
})
export class SetPasswordComponent  implements OnInit {
  setPasswordForm : FormGroup;
  newPassword : any;
  confirmPassword :any;
  error : Boolean = false;
  message: string;
  company:any;
  tokenUrl : string ;
  constructor(
    public fb: FormBuilder,public _userService: UserService,
    public _loggedInSerivce : LoggedInService,
    public _cookieService : CookieService,
    public _subDomainService : SubDomainService,
    public _router :Router
  ){}

   ngOnInit() {
     var link = window.location.hostname;
     this.company = link.split('.')[0];
     var url        = window.location.pathname;
     this.tokenUrl = url.split('/')[2];
     this.setPasswordForm = this.fb.group({
      newPassword     : [this.newPassword, Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword : [this.confirmPassword, Validators.compose([Validators.required, Validators.minLength(8)])]
    });
    jQuery.material.init();
  }

  errorShow() {
    this.error = true ;
  }
  errorHide() {
    this.error = false ;
    this.message ='';
  }


 setPassword(value?: any) {
    var url        = window.location.pathname;
    this.tokenUrl = url.split('/')[2];
    jQuery('#btnSetNewPassword').text('Please Wait...');
    jQuery('#btnSetNewPassword').attr('disabled',true);
		value = this.setPasswordForm.value;
    let new_password = value.newPassword;
    let confirm_password = value.confirmPassword;
    if(new_password === confirm_password) {
      let resetPassword = this._userService.setNewPassword(confirm_password)
          .subscribe(
          (response: any) => {
            response.companyList.push(this.company);
            if(response.token) {
              // console.log('RESET PASSWORD',JSON.stringify(response));
              this._subDomainService.setCurrentCompany(response.company);
              let storage = {
                  'token'  : response.token,
                  'user'   : response.user,
                  'company_id': this.company,
                  // 'company':JSON.parse(localStorage.getItem('lodashAuthToken')),
                  'currentCompany': response.company.sub_domain,
                  'companyList': response.companyList
              };
              this._cookieService.createCookie('storage', JSON.stringify(storage),3);
              this._cookieService.createCookie('filepicker_token_json', JSON.stringify(response.companyAccess), 3);
              this._loggedInSerivce.login();
              // if(response.user.role !== 'ADMIN'){
                let status = {
                  cardStatus: response.subscription.currentplan.customer.card_status,
                  subsStatus: response.subscription.currentplan.subscription.status
                  };
                  this._cookieService.createCookie('status',JSON.stringify(status),3);
              //}
              if(this.tokenUrl === 'forgetPassword') {
                 //this._router.navigateByUrl('dashboard');
                  let link = window.location.pathname;
                  let dashboard = link.split('/')[0]+'/dashboard';
                  jQuery(location).attr('href', dashboard );
              } else {
                  this._router.navigateByUrl('/userApproval');
              }
            }
          },
          (error :any ) =>  {
            this.error = error.error.err_message;
            resetPassword.unsubscribe();
            jQuery('#btnSetNewPassword').text('Update');
            jQuery('#btnSetNewPassword').attr('disabled',false);
          }
    );
    }else {
      this.message = 'Passwords do not match';
      jQuery('#btnSetNewPassword').text('Update');
      jQuery('#btnSetNewPassword').attr('disabled',false);
    }
  }
}
