import {Component, OnInit} from '@angular/core';
import {PlanService} from "../../../shared/services/plan.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'og-company-plans',
  templateUrl: './company-plans.component.html',
  styleUrls: ['../plans.component.css', './../custom-material.css'
    , './../features/features.component.css']
})
export class CompanyPlansComponent implements OnInit {

  loading: boolean = true;
  planFeatures: any;
  planTypes: Array<any>;
  featureUpdate: Map<String, Object> = new Map<String, Object>();

  selectedPlanCategory: String = 'default';
  selectedPlan: String;
  keys = Object.keys;

  constructor(private _planService: PlanService) {
  }

  ngOnInit() {

    this.loading = true;
    this._planService.getPlanTypes().subscribe(response => {
      this.planTypes = response;
      this.loading = false;
    });
    this.fetchPlanFeature('business');
  }

  fetchPlanFeature(planId) {
    this.loading = true;
    this.selectedPlan = planId;
    this._planService.getAllCompanyFeaure(planId)
      .subscribe((result) => {
        this.loading = false;
        this.planFeatures = result;
        this.loading = false;
      });
  }

  updateParentFeature(parentFeature) {
    if (!parentFeature.active) {
      parentFeature.sub_features.forEach(feat => {
        feat.active = false;
        this.updateChildFeature(parentFeature.sub_features, parentFeature);
      });
    }
    this.featureUpdate.set(parentFeature._id, parentFeature);
  }

  updateChildFeature(childFeature, parentFeature) {
    if (childFeature.active) {
      parentFeature.active = true;
      this.updateParentFeature(parentFeature);
    }
    this.featureUpdate.set(childFeature._id, childFeature);
  }

  updateCompanyPlan() {
    let request = [];

    this.featureUpdate.forEach((value: any, key: String) => {
      request.push({
        _id: value._id,
        active: value.active
      });
    });

    this._planService.updateCompanyFeatures(this.selectedPlan, request)
      .subscribe(response => {
      })
  }
}
