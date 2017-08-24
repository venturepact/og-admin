import {Component, OnInit} from '@angular/core';
import {CookieService} from '../../shared/services/cookie.service';
import {Router} from '@angular/router';
import {PlanService} from '../../shared/services/plan.service';
import {AdminService} from '../../shared/services/admin.service';

declare var jQuery: any;

@Component({
  selector: 'og-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css', './custom-material.css'],
})

export class PlansComponent implements OnInit {
  plans: any;
  planTypes: Array<any>;
  planNames: Array<any>;

  loading = false;
  addon_leads: String = '';
  addon_traffic: String = '';
  siteSettingMsg: String = '';
  selectedPlanCategory: String = 'default';
  keys = Object.keys;
  createPlanModel = {
      _id: 'new_plan',
      name: 'New Plan',
      plan_type: 'default',
      source_plan: '',
      companies: 0,
      leads: 0,
      visits: 0,
      templates: 0,
      calculators: 0,
      users: 0,
      description: ''
  };

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
        const planOb = [];
        for (let planType in this.plans) {
            this.plans[planType].forEach(plan => planOb.push({ id: plan.plan._id, text: plan.plan.name }));
        }
        this.planNames = planOb;
      });
    this.populatePlanTypes ();
  }

  onPlanTypeSelected (e) {
      console.log(e);
      this.createPlanModel.plan_type = e.id;
  }

  onPlanSelected (e) {
      console.log(e);
      this.createPlanModel.source_plan = e.id;
  }

    onPlanDeselect (e) {
      this.createPlanModel.source_plan = '';
    }

  populatePlanTypes () {
      this._planService.getPlanTypes()
          .subscribe(
              data => this.planTypes = data.map(type => Object.assign({}, { 'id': type, 'text': type })),
              error => console.log(error)
          );
  }

  createPlan () {
      if (!this.createPlanModel.name || !this.createPlanModel.plan_type) {
          alert('Fill in details');
          return;
      }
      this._planService.createPlan(this.createPlanModel)
          .subscribe(
              data => {
                  jQuery('#planModal').modal('hide');
                  window.location.reload();
              },
              error => console.log(error)
          );
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
