import { PlanService } from './../../shared/services/plan.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansComponent } from './plans.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { FeaturesComponent } from './features/features.component';
import { PremadesComponent } from './premades/premades.component';
import { PlanComponent } from './plan/plan.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [PlansComponent, FeaturesComponent, PremadesComponent, PlanComponent],
  providers:[PlanService]
})
export class PlansNewModule { }
