import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FeaturesComponent} from './features/features.component';
import {PlansComponent} from './plans.component';
import {PlanService} from  './../../shared/services/plan.service';

import {SharedModule} from './../../shared/modules/shared.module';

@NgModule({

  imports: [
  	SharedModule,
  	RouterModule
  	],
  declarations: [FeaturesComponent, PlansComponent],
  providers: [PlanService]

})

export class PlanModule {}