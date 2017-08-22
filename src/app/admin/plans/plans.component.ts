import {Component, OnInit} from '@angular/core';
import {CookieService} from "../../shared/services/cookie.service";
import {Router} from "@angular/router";
import {PlanService} from "../../shared/services/plan.service";
import {AdminService} from "../../shared/services/admin.service";

declare var jQuery: any;

@Component({
  selector: 'og-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css', './custom-material.css'],
})

export class PlansComponent implements OnInit {
  plans: any;
  loading: boolean = false;
  addon_leads: String = '';
  addon_traffic: String = '';
  siteSettingMsg: String = '';
  selectedPlanCategory: String = 'default';
  keys = Object.keys;

  constructor(public _planService: PlanService, public _adminService: AdminService,
              public _cookieService: CookieService, public router: Router) {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if (storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngOnInit() {
    this.addon_leads = 'helo';
    this.loading = true;
    this.getSiteSettings();
    this._planService.getPlans()
      .subscribe((result) => {
        this.plans = result;
        this.loading = false;
      })
  }

  getSiteSettings() {
    this._adminService.getSiteSettings()
      .subscribe((result) => {
        this.addon_leads = result.addon.leads;
        this.addon_traffic = result.addon.traffic;
      });
  }

  updateSiteSettings() {
    this.loading = true;
    let data = {
      addon: {
        leads: this.addon_leads,
        traffic: this.addon_traffic
      }
    };
    this._adminService.updateSiteSettings(data)
      .subscribe((result) => {
        this.addon_leads = result.addon.leads;
        this.addon_traffic = result.addon.traffic;
        this.loading = false;
        this.siteSettingMsg = 'settings updated successfully';
      }, (error) => {
        this.loading = false;
        this.siteSettingMsg = error.error.message;
      });

  }

  hello(plan) {
    console.log(plan);
  }
}
