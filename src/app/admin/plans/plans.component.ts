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
  selectedPlan:any;
  manage='features';
  loading = false;
  addon_leads: String = '';
  addon_traffic: String = '';
  siteSettingMsg: String = '';
  selectedPlanCategory: string = 'default';
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
  fetchPlanModal = {
    error: '',
    successMsg: '',
    placeholder: 'No plans to be fetched',
    api_url: 'https://outgrow-api.herokuapp.com/api/v1',
    fetchedPlansList: [],
    selectedPlanIds: []
  };

  constructor(private _planService: PlanService, private _adminService: AdminService,
              private _cookieService: CookieService, private router: Router) {
    if (this._cookieService.readCookie('storage')) {
      let storage = JSON.parse(this._cookieService.readCookie('storage'));
      if (storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngOnInit() {
    this.addon_leads = '';
    this.loading = true;
    this.getSiteSettings();
    this._planService.getPlans()
      .subscribe((result) => {
        this.plans = result;
        this.loading = false;
        this.selectedPlan=this.setPlan(this.selectedPlanCategory);
        
        const planOb = [];
        for (let planType in this.plans) {
          this.plans[planType].forEach(plan => planOb.push({id: plan.plan._id, text: plan.plan.name}));
        }
        this.planNames = planOb;
      });
    this.populatePlanTypes();
  }

  onPlanTypeSelected(e) {
    console.log(e);
    this.createPlanModel.plan_type = e.id;
  }

  onPlanSelected(e) {
    console.log(e);
    this.createPlanModel.source_plan = e.id;
  }

  onPlanDeselect(e) {
    this.createPlanModel.source_plan = '';
  }

  populatePlanTypes() {
    this._planService.getPlanTypes()
      .subscribe(
        data => this.planTypes = Object.keys(data).map(type => Object.assign({},
          {
            id: type,
            text: type
          })),
        error => console.log(error)
      );
  }

  createPlan() {
    if (!this.createPlanModel.name || !this.createPlanModel.plan_type) {
      alert('Fill in details');
      return;
    }
    this.createPlanModel._id.trim();
    this.createPlanModel.name.trim();
    this._planService.createPlan(this.createPlanModel)
      .subscribe(
        data => {
          jQuery('#planModal').modal('hide');
          window.location.reload();
        },
        error => console.log(error)
      );
  }

  fetchPlanList() {
    let url = this.fetchPlanModal.api_url;
    if (!url.endsWith('/api/v1')) {
      url += '/api/v1';
    }

    this._planService.fetchPlanListFromAPIs(url)
      .subscribe(
        result => {
          this.fetchPlanModal.placeholder = 'Select plans to be imported';
          this.fetchPlanModal.fetchedPlansList = result.map(plan => ({id: plan._id, text: plan.name}));
        },
        error => {
          if (error.error && error.error.message) {
            return this.fetchPlanModal.error = error.error.message;
          }
          this.fetchPlanModal.error = 'Error occurred, please check network';
          console.log(error);
        }
      );
  }

  onFetchedPlanSelect(e) {
    this.fetchPlanModal.selectedPlanIds.push(e.id);
  }

  onFetchedPlanRemove(e) {
    this.fetchPlanModal.selectedPlanIds.splice(
      this.fetchPlanModal.selectedPlanIds.indexOf(e.id),
      1
    );
  }

  fetchAndSavePlans() {
    let url = this.fetchPlanModal.api_url;
    if (!url.endsWith('/api/v1')) {
      url += '/api/v1';
    }
    console.log(this.fetchPlanModal.selectedPlanIds);
    this._planService.fetchPlanDataFromAPI(url, this.fetchPlanModal.selectedPlanIds)
      .subscribe(
        data => {
          this._planService.saveFetchedPlanData(data)
            .subscribe(
              result => {
                console.log(result);
                const savedPlans = result.savedPlans.map(plan => plan._id).join('-');
                const existingPlans = result.existingPlanIds.join('-');
                this.fetchPlanModal.successMsg = `Saved plans - ${savedPlans} | Existing Plans - ${existingPlans}`;
                this.fetchPlanModal.selectedPlanIds = [];
              },
              error => {
                if (error.error && error.error.message) {
                  return this.fetchPlanModal.error = error.error.message;
                }
                this.fetchPlanModal.error = 'Error occurred, please check network';
              }
            );
        },
        error => {
          if (error.error && error.error.message) {
            return this.fetchPlanModal.error = error.error.message;
          }
          this.fetchPlanModal.error = 'Error occurred, please check network';
        }
      );
  }

  handleEvent(e) {
    console.log('Inside handle event', e);
    if (e.event === 'DELETED') {
      console.log(e);
    }
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
  setPlan(category){
    if(category == 'default')
      return JSON.parse(JSON.stringify(this.plans[category][1]));
    return JSON.parse(JSON.stringify(this.plans[category][0]));
  }
  copyPlan(plan){
    return JSON.parse(JSON.stringify(plan));
  }
}
