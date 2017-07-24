import { NgModule } from '@angular/core';
import { NavBarModule } from './components/+navbar/navbar.module';
import { SiteComponent } from './site.component';
import {routes} from "../config/routes/index";
import {SharedModule} from "../shared/modules/shared.module";
import {IntegrationService} from "../shared/services/integration.service";
import {ToolbarModule} from "./components/toolbar/toolbar.module";
// import { ReferralCandyComponent } from './../shared/referralCandy/referralCandy.component';

@NgModule({
  declarations: [
    SiteComponent,
  ],
  imports: [
    routes,
    SharedModule,
    ToolbarModule,
    NavBarModule
  ],
  exports : [SiteComponent],
  providers: [IntegrationService]
})
export class SiteModule { }
