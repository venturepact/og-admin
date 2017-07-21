import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../shared/services/user.service';
import {LoggedInService} from '../../../shared/services/logged-in.service';
import {CookieService} from '../../../shared/services/cookie.service';
import {SubDomainService} from '../../../shared/services/subdomain.service';

declare var jQuery:any;

@Component({
  selector: 'user-approval',
  templateUrl: './userApproval.component.html'
})
export class UserApprovalComponent  implements OnInit {
  errorMsg: string ;
  currenCompany: any;
  constructor(
    public _router: Router,          
    public _userService: UserService,
    public _loggedInSerivce: LoggedInService,
    public _cookieService: CookieService,
    public _subDomainService: SubDomainService 
  ){
    this.currenCompany = this._subDomainService.currentCompany;
  }

  ngOnInit() {
    this.adminApproval();
    this.userApproval();
  }

  userApproval() {
     let approval = this._userService.userApproval()
        .subscribe(
          (response: any) => {
              this._loggedInSerivce.login();
               this._userService.updatebillingStatus()
                  .subscribe((status:any)=> {
                    this._cookieService.createCookie('filepicker_token_json',JSON.stringify(status),3);
                    let link = window.location.pathname;
                    let dashboard = link.split('/')[0]+'/dashboard';
                    jQuery(location).attr('href', dashboard );
                  });
          },
          (error :any ) =>  {
           jQuery('#approval-error').removeClass('hide');
           this.errorMsg = error.error.err_message;
           approval.unsubscribe();
          }
    );
   }

  adminApproval(){
      // let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if(this.currenCompany.is_admin_created){
          let approval = this._userService.userApproval()
          .subscribe(
            (response: any) => {
                this._loggedInSerivce.login();
                this._userService.updatebillingStatus()
                    .subscribe((status:any)=> {
                      this._cookieService.createCookie('filepicker_token_json',JSON.stringify(status),3);
                      let link = window.location.pathname;
                      let dashboard = link.split('/')[0]+'/dashboard';
                      jQuery(location).attr('href', dashboard );
                    });
            },
            (error :any ) =>  {
            jQuery('#approval-error').removeClass('hide');
            this.errorMsg = error.error.err_message;
            approval.unsubscribe();
            }
          );
        }
      }

   home() {
      let link = environment.APP_DOMAIN;
      let protocol = environment.PROTOCOL;
      jQuery(location).attr('href',protocol + link);
   }

}
