import { PlansNewModule } from './plans-new/plans-new.module';
import { FeaturesModule } from './features/features.module';
import { PremadeCalcService } from './../shared/services/premade-calc.service';
import { LocaleService } from './../site/+builder/services/locale.service';
import { LocalesAdminComponent } from './locale/locale-admin.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ADMIN_ROUTES } from "./../config/routes/admin.routes";
// importing components
import { HomeComponent } from "./home/home.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { BasicComponent } from "./basic/basic.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { AdminComponent } from "./admin.component";
import { AllUsersComponent } from "./users/all-users/all-users.component";
import { AllCompaniesComponent } from "./companies/all-companies/all-companies.component";
import { EmailLogsComponent } from "./email-logs/email-logs.component";
import { LeadsComponent } from "./leads/leads.component";
import { CouponsComponent } from "./coupons/coupons.component";
import { SitesettingsComponent } from "./sitesettings/sitesettings.component";
import { AllFeaturesComponent } from "./allFeatures/allFeatures.component";
// importing services
import { AdminService } from "./../shared/services/admin.service";
import { CompanyService } from "./../shared/services/company.service";
import { UserService } from "./../shared/services/user.service";
// importing modules
import { SingleCompanyModule } from "./companies/single-company/single-company.module";
import { SingleUserModule } from "./users/single-user/single-user.module";
import { SingleadminModule } from "./sub-admin/single-admin/single-admin.module";
import { PlanModule } from "./plans/plan.module";
import { SubDomainModule } from "./subdomain/subdomain.module";
import { UtilitiesModule } from "../shared/modules/utilities.module";
import { CompanyDetailsComponent } from "./success-rate/company-details/company-details.component";
import { LogComponent } from './log/log.component';
import { SearchCalcComponent } from './search-calc/search-calc.component';
import { SuccessRateComponent } from "./success-rate/success-rate.component";
import { CustomJsApprovalsComponent } from './custom-js-approvals/custom-js-approvals.component';
import { PromotionChecklist } from './promotion-checklist/promotion-checklist.component';
import { SubAdminComponent } from './sub-admin/all-admin/sub-admin.component';
import { CalculatorAnalytics } from "../site/components/+analytics/services/calculator-analytics.service";
import { JSONCompare } from "../shared/services/helper-service/json-compare";
import { LondonerComponent } from './londoner/londoner.component';
import { FeatureAuthService } from "../shared/services/feature-access.service";
import { PromoGoalsComponent } from "./sitesettings/promo-goals/promo-goals.component";
import { DealsComponent } from "./sitesettings/deals/deals.component";
import { SpecialDealComponent } from "./special-deal/special-deal.component";
import { PremaidComponent } from "./premaidCalc/premaid-calc.component";
import { LondonerService } from "../shared/services/londoner.service";
import { PremaidService } from '../shared/services/premaid.service';
import { SharedModule } from "../shared/modules/shared.module";
import { IntegrationLogsComponent } from './integration-logs/integration-logs.component';
import { IntegrationLogDetailsComponent } from './integration-logs/integration-log-details/integration-log-details.component';

import {HelloBarComponent} from "./hello-bar/hello-bar.component";
import {EditHelloBarComponent} from "./hello-bar/edit-hello-bar/edit-hello-bar.component";
import { AutologinTokenComponent } from "./sitesettings/autologin-token/autologinToken.component";
import { CacheHandlingComponent } from './cache-handling/cache-handling.component';

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES), SharedModule, PlanModule, SubDomainModule, SingleCompanyModule,
    SingleUserModule, UtilitiesModule, SingleadminModule, FeaturesModule,PlansNewModule],

  declarations: [AdminComponent, HomeComponent, SidebarComponent, BasicComponent, ToolbarComponent,
    AllUsersComponent, AllCompaniesComponent, EmailLogsComponent, LeadsComponent, CouponsComponent,
    SitesettingsComponent, AllFeaturesComponent, SuccessRateComponent, CompanyDetailsComponent,
    SearchCalcComponent, LogComponent, LocalesAdminComponent, CustomJsApprovalsComponent, SubAdminComponent,
    PromotionChecklist, DealsComponent, PromoGoalsComponent, LondonerComponent,
    SpecialDealComponent, IntegrationLogsComponent, IntegrationLogDetailsComponent, PremaidComponent,
    HelloBarComponent, EditHelloBarComponent, AutologinTokenComponent, CacheHandlingComponent],

  providers: [AdminService, CompanyService, UserService, LocaleService, CalculatorAnalytics,
    JSONCompare,LondonerService, FeatureAuthService, PremaidService,PremadeCalcService]
})

export class AdminModule {
}
