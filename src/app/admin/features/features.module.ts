import { PremadeCalcsService } from './services/premade-calcs.service';
import { FeaturesService } from './services/features.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './features.component';
import { PremadeCalcsComponent } from './premade-calcs/premade-calcs.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
export const featureRoutes: Routes = [
  // {path:'',component:FeatureComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(featureRoutes),
    SharedModule
  ],
  providers:[FeaturesService,PremadeCalcsService],
  declarations: [FeatureComponent,PremadeCalcsComponent]
})
export class FeaturesModule { }