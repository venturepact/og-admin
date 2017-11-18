import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../../shared/services/admin.service';
import { CookieService } from "../../../shared/services/cookie.service";

declare var jQuery: any;

// styleUrls: ['sidebar.component.css'], removed because causing build issues
@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  currentTab = 'users';
  sub_role: String = '';

  constructor(public _adminService: AdminService, public _cookieService: CookieService) {
    if (_cookieService.readCookie('storage')) {
      let storage = JSON.parse(_cookieService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
  }

  ngOnInit() {
    let curUrlDomain = window.location.pathname.split('/');
    this.currentTab = curUrlDomain[curUrlDomain.length - 1];
    this.showTab(this.currentTab);
  }

  showTab(tab: any) {
    this.currentTab = tab;
    jQuery('.setting-nav').removeClass('active');
    if (tab === 'users') {
      jQuery('#userSet').addClass('active');
    }
    else if (tab === 'companies') {
      jQuery('#compSet').addClass('active');
    }
    else if (tab === 'plans') {
      jQuery('#plnSet').addClass('active');
    }
    else if (tab === 'sub_domains') {
      jQuery('#sub_domainSet').addClass('active');
    }
    else if (tab === 'email-logs') {
      jQuery('#email-logs').addClass('active');
    }
    else if (tab === 'error-logs') {
      this._adminService.notifylogType('errorLogs');
      jQuery('#error-logs').addClass('active');
    }
    else if (tab === 'locales-admin') {
      jQuery('#locales-admin').addClass('active');
    }
    else if (tab === 'londoner') {
      jQuery('#londonerSet').addClass('active');
    }
    else if (tab === 'specialdeals-tab') {
      jQuery('#special_deals-tab').addClass('active');
    }
    else if (tab === 'integration-log') {
      jQuery('#integration-logs').addClass('active');
    }
    else if (tab == 'premaidcalc') {
      jQuery('premaidset').addClass('active');
    }
    else if(tab == 'premade-calcs'){
      jQuery('#premade-calcs').addClass('active');
    }
    else if (tab === 'company_plans') {
      jQuery('#company_plans').addClass('active');
    }
    // else if (tab === 'customJSApprovals') {
    // 		this._adminService.notifylogType('customJSApprovals')
    // 	jQuery('#customJSApprovals').addClass('active');
    // }
    else if (tab === 'response-logs') {
      this._adminService.notifylogType('requestsLogs')
      jQuery('#response-logs').addClass('active');
    }
    else if (tab === 'leads-tab') {
      jQuery('#leads-tab').addClass('active');
    }
    else if (tab === 'couponcode-tab') {
      jQuery('#couponcode-tab').addClass('active');
    }
    else if (tab === 'promotion-checklist') {
      jQuery('#promotion-checklist').addClass('active');
    }
  }
}
