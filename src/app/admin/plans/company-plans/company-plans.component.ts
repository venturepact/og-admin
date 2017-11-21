import {Component, OnInit} from '@angular/core';
import {PlanService} from "../../../shared/services/plan.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-company-plans',
  templateUrl: './company-plans.component.html',
  styleUrls: ['../plans.component.css', './../custom-material.css'
    , './../features/features.component.css']
})
export class CompanyPlansComponent implements OnInit {

  loading: boolean = false;
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
    this.selectedPlan = planId;
    this._planService.getAllCompanyFeaure(planId)
      .subscribe((result) => {
        this.planFeatures = result;
        this.loading = false;
      });
  }

  updateParentFeature(parentFeature) {
    console.log(parentFeature);
    if (!parentFeature.active) {
      parentFeature.sub_features.forEach(feat => {
        feat.active = false;
      });
    }
    if (this.featureUpdate.has(parentFeature._id)) {
      this.featureUpdate.delete(parentFeature._id);
    }
    this.featureUpdate.set(parentFeature._id, parentFeature);
    //  this.featureUpdate.push(parentFeature);

  }

  updateChildFeature(childFeature, parentFeature) {
    console.log(childFeature, parentFeature);
    if (childFeature.active) {
      parentFeature.active = true;
    }
    if (this.featureUpdate.has(parentFeature._id)) {
      this.featureUpdate.delete(parentFeature._id);
    }
    this.featureUpdate.set(parentFeature._id, parentFeature);
  }

  updateCompanyPlan() {
    let request = [];

    this.featureUpdate.forEach((value: any, key: String) => {
      request.push({
        _id: value._id,
        active: value.active
      });

      value.sub_features.forEach(feat => {
        request.push({
          _id: feat._id,
          active: feat.active
        });
      });
    });

    this._planService.updateCompanyFeatures(this.selectedPlan, request)
      .subscribe(response => {
      })
  }

}
