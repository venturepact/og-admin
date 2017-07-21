import { Component, OnInit } from '@angular/core';
import {CookieService} from '../../../shared/services/cookie.service';
import {IntegrationService} from '../../../shared/services/integration.service';
import {environment} from '../../../../environments/environment';
import { Router } from '@angular/router';
declare var jQuery: any;
@Component({
    selector: 'app-og-salesforce-redirect',
    styleUrls: ['./salesforce-redirect.component.css'],
    templateUrl: './salesforce-redirect.component.html'
})
export class SalesforceRedirectComponent implements OnInit {
    salesforceError: string;
    isSalesforceError: boolean = false;
    constructor(public _cookieService: CookieService, public _integrationService: IntegrationService, public router: Router) { }

    ngOnInit() {
        this.getAuthorizationCode();
     }

     getAuthorizationCode() {
         let companyId = this._cookieService.readCookie('comp');
         let authcode = decodeURIComponent(window.location.search.split('code=')[1]);
         let data = {
             authcode: authcode,
         };
         this._integrationService.authorization(data, 'salesforce' , companyId)
            .subscribe((result) => {
                console.log('result in -----------------------------auth', result);
                this._cookieService.createCookie('comp', 'success', 3);
            }, (error) => {
                this._cookieService.eraseCookie('comp');
                this.isSalesforceError = true;
                this.salesforceError = error.error.err_message;
               // jQuery('#salesforce-error').modal({backdrop: 'static', keyboard: false});
                jQuery('#salesforce-error').modal('show');
            });
     }

     close() {
         window.close();
     }
}
