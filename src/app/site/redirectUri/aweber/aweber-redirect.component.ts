import { Component, OnInit } from '@angular/core';
import {CookieService} from '../../../shared/services/cookie.service';
import {IntegrationService} from '../../../shared/services/integration.service';
import {environment} from '../../../../environments/environment';
import { Router } from '@angular/router';
declare var jQuery: any;
@Component({
    selector: 'app-og-aweber-redirect',
    styleUrls: ['./aweber-redirect.component.css'],
    templateUrl: './aweber-redirect.component.html'
})
export class AweberRedirectComponent implements OnInit {
    mailChimpError: string;
    ismailChimpError: boolean = false;
    constructor(public _cookieService: CookieService, public _integrationService: IntegrationService, public router: Router) { }

    ngOnInit() {
        this.getAuthorizationCode();
     }

     getAuthorizationCode() {
         let companyId = this._cookieService.readCookie('comp');
         let authcode = window.location.search.split('&');
         let auth_token = authcode[0].split('=')[1];
         let authToken_verifier = authcode[1].split('=')[1];
         let data = {
             oauth_token: auth_token,
             oauth_verifier :  authToken_verifier
         };
        //  console.log(data,'>>>>>>>>>>>>>>>>>>>>', authcode);
        this._integrationService.authorization(data, 'aweber' , companyId)
            .subscribe((result) => {
                // console.log('result in -----------------------------auth', result);
                this._cookieService.createCookie('comp', 'success', 3);
            }, (error) => {
                this._cookieService.eraseCookie('comp');
                this.ismailChimpError = true;
                this.mailChimpError = error.error.err_message;
                jQuery('#mailchimp-error').modal('show');
            });
     }

     close() {
         window.close();
     }
}
