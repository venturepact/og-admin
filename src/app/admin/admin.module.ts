import {LocaleService} from './../site/+builder/services/locale.service';
import {LocalesAdminComponent} from './locale/locale-admin.component';
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ADMIN_ROUTES} from "./../config/routes/admin.routes";
// importing components
import {HomeComponent} from "./home/home.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {BasicComponent} from "./basic/basic.component";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {AdminComponent} from "./admin.component";
import {AllUsersComponent} from "./users/all-users/all-users.component";
import {AllCompaniesComponent} from "./companies/all-companies/all-companies.component";
import {EmailLogsComponent} from "./email-logs/email-logs.component";
import {LeadsComponent} from "./leads/leads.component";
import {CouponsComponent} from "./coupons/coupons.component";
import {SitesettingsComponent} from "./sitesettings/sitesettings.component";
import {AllFeaturesComponent} from "./allFeatures/allFeatures.component";
// importing services
import {AdminService} from "./../shared/services/admin.service";
import {CompanyService} from "./../shared/services/company.service";
import {UserService} from "./../shared/services/user.service";
// importing modules
import {SharedModule} from "./../shared/modules/shared.module";
import {SingleCompanyModule} from "./companies/single-company/single-company.module";
import {SingleUserModule} from "./users/single-user/single-user.module";
import {SingleadminModule} from "./sub-admin/single-admin/single-admin.module";
import {PlanModule} from "./plans/plan.module";
import {SubDomainModule} from "./subdomain/subdomain.module";
import {UtilitiesModule} from "../shared/modules/utilities.module";
import {CompanyDetailsComponent} from "./success-rate/company-details/company-details.component";
import {LogComponent} from './log/log.component';
import {SearchCalcComponent} from './search-calc/search-calc.component';
import {SuccessRateComponent} from "./success-rate/success-rate.component";
import {CustomJsApprovalsComponent} from './custom-js-approvals/custom-js-approvals.component';
import {PromotionChecklist} from './promotion-checklist/promotion-checklist.component';
import {SubAdminComponent} from './sub-admin/all-admin/sub-admin.component';
import {CalculatorAnalytics} from "../site/components/+analytics/services/calculator-analytics.service";
import {SubAdminLogDetailComponent} from "./sub-admin/sub-admin-log-detail/sub-admin-log-detail.component";
import {JSONCompare} from "../shared/services/helper-service/json-compare";

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES), SharedModule, PlanModule, SubDomainModule, SingleCompanyModule,
    SingleUserModule, UtilitiesModule, SingleadminModule],

  declarations: [AdminComponent, HomeComponent, SidebarComponent, BasicComponent, ToolbarComponent,
    AllUsersComponent, AllCompaniesComponent, EmailLogsComponent, LeadsComponent, CouponsComponent, SitesettingsComponent, AllFeaturesComponent,
    SuccessRateComponent, CompanyDetailsComponent, SearchCalcComponent, LogComponent, LocalesAdminComponent, CustomJsApprovalsComponent,
    SubAdminComponent, SubAdminLogDetailComponent, PromotionChecklist],
  providers: [AdminService, CompanyService, UserService, LocaleService, CalculatorAnalytics,
    JSONCompare]
})

export class AdminModule {
}
