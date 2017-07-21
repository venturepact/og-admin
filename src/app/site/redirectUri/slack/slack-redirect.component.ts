import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../../shared/services/cookie.service';
import { IntegrationService } from '../../../shared/services/integration.service';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery: any;
@Component({
    selector: 'og-slack-redirect',
    templateUrl: './slack-redirect.component.html'
})
export class SlackRedirectComponent implements OnInit {

    slackError: string;
    isSlackError: boolean = false;
    constructor(public _cookieService: CookieService, public _integrationService: IntegrationService, public router: Router, public _route: ActivatedRoute) { }

    ngOnInit() {
        this.getAuthorizationCode();
    }

    getAuthorizationCode() {
        let companyId = this._cookieService.readCookie('comp');
        console.log(companyId);
        let params: any = this._route.snapshot.queryParams['code'];
        let data = {
            authcode: params,
        };
        this._integrationService.authorization(data, 'slack', companyId)
            .subscribe((result) => {
                console.log('result in -----------------------------auth', result);
                this._cookieService.createCookie('comp', 'success', 3);
            }, (error) => {
                this._cookieService.eraseCookie('comp');
                this.isSlackError = true;
                this.slackError = error.error.err_message;
                // jQuery('#salesforce-error').modal({backdrop: 'static', keyboard: false});
                jQuery('#slack-error').modal('show');
            });
    }

    close() {
        window.close();
    }

}
