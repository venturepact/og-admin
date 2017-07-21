import { Component, OnInit } from '@angular/core';
import { PlanService } from './../../shared/services/plan.service';
import { FeaturesComponent } from './features/features.component';
import { AdminService} from './../../shared/services/admin.service';
import {CookieService} from "../../shared/services/cookie.service";
import {Router} from "@angular/router";
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
	siteSettingMsg : String = '';
	constructor(public _planService: PlanService, public _adminService: AdminService, public _cookieService: CookieService, public router: Router) {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if(storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
	}

	ngOnInit() {
		this.addon_leads= 'helo';
		this.loading = true;
		this.getSiteSettings();
		this._planService.getPlans()
			.subscribe((result) => {
				// console.log(result);
				this.plans = result;
				this.loading = false;
			})
	}

	getSiteSettings() {
		this._adminService.getSiteSettings()
			.subscribe((result) => {
				this.addon_leads = result.addon.leads;
				this.addon_traffic = result.addon.traffic;
				//console.log(result);
			},(error) => {
				console.log('error in get site settings', error);
			})
	}

	updateSiteSettings() {
		this.loading = true;
		let data = {
			addon : {
				leads : this.addon_leads,
				traffic : this.addon_traffic
			}
		};
		this._adminService.updateSiteSettings(data)
			.subscribe((result) => {
				this.addon_leads = result.addon.leads;
				this.addon_traffic = result.addon.traffic;
				this.loading = false;
				this.siteSettingMsg = 'settings updated successfully';
				//console.log('updated', result);
			}, (error) => {
				console.log(error);
				this.loading = false;
				this.siteSettingMsg = error.error.message;
			});

	}

}
