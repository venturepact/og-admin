import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeaturesComponent} from './features/features.component';
import {PlansComponent} from './plans.component';
import {SharedModule} from "../../shared/modules/shared.module";
import {PlanService} from "../../shared/services/plan.service";
import {CompanyPlansComponent} from "./company-plans/company-plans.component";

@NgModule({

  imports: [
  	SharedModule,
  	RouterModule
  	],
  declarations: [FeaturesComponent, PlansComponent, CompanyPlansComponent],
  providers: [PlanService]
})

export class PlanModule {}
