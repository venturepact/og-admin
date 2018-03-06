import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../shared/services/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plansData: any = []
  constructor(public _planService: PlanService) { }
  selectedPlan: any;
  templates: any = [];
  ngOnInit() {
    this.getPlanFeatures();
  }
  getPlanFeatures() {
    this._planService.getAllPlans().subscribe(data => {
      console.log(data);
      this.plansData = data;
      (this.plansData.length) && (this.selectedPlan = this.plansData[0]);
      (this.selectedPlan) && (this.templates = this.getFeatures(this.selectedPlan['features'], 'templates'));
    })
  }
  planChanged(plan) {
    if (this.plansData.length) {
      this.selectedPlan = this.plansData.find(planData => {
        return (planData['plan']['_id'] === plan)
      });
      this.templates = this.getFeatures(this.selectedPlan['features'], 'templates');
    }
  }
  // updateSelectedPlan(changes) {
  //   if (changes.length > 0) {
  //     this.templates = this.getFeatures(changes, 'templates');
  //   }
  // }
  emitChanges(changes) {
    changes = this.getFeatures(changes, 'templates');
    changes.length && this._planService.planTemplates.next(changes);
  }
  getFeatures(features, parentFeature) {
    let item = features.find(feature => {
      return feature['_id'] === parentFeature;
    });
    return (item ? item['sub_features'] : []);
  }
}
