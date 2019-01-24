import { LayoutPreviewComponent } from './../../admin/layout-preview/layout-preview.component';
import { LocalesAdminComponent } from './../../admin/locale/locale-admin.component';
import { Routes } from "@angular/router";
import { AdminComponent } from "./../../admin/admin.component";
import { HomeComponent } from "./../../admin/home/index";
import { SubDomainComponent } from "./../../admin/subdomain/subdomain.component";
import { AllUsersComponent } from "./../../admin/users/all-users/all-users.component";
import { SingleUserComponent } from "./../../admin/users/single-user/single-user.component";
import { AllCompaniesComponent } from "./../../admin/companies/all-companies/all-companies.component";
import { SingleCompanyComponent } from "./../../admin/companies/single-company/single-company.component";
import { EmailLogsComponent } from "./../../admin/email-logs/email-logs.component";
import { LeadsComponent } from "./../../admin/leads/leads.component";
import { CouponsComponent } from "./../../admin/coupons/coupons.component";
import { SitesettingsComponent } from "./../../admin/sitesettings/sitesettings.component";
import { PlansComponent } from "./../../admin/plans-new/plans.component";
import { AllFeaturesComponent } from "./../../admin/allFeatures/allFeatures.component";
import { LondonerComponent } from '../../admin/londoner/londoner.component';
import { AdminGuard } from "./../../shared/authentication/admin.guard";
import { AdminLtdGuard } from "./../../shared/authentication/admin-ltd.guard";
import { BasicComponent } from "./../../admin/basic/basic.component";
import { SuccessRateComponent } from "../../admin/success-rate/success-rate.component";
import { LogComponent } from '../../admin/log/log.component';
import { SearchCalcComponent } from "../../admin/search-calc/search-calc.component";
import { CustomJsApprovalsComponent } from '../../admin/custom-js-approvals/custom-js-approvals.component'
import { PromotionChecklist } from '../../admin/promotion-checklist/promotion-checklist.component';
import { SubAdminComponent } from '../../admin/sub-admin/all-admin/sub-admin.component';
import { SingleadminComponent } from '../../admin/sub-admin/single-admin/single-admin.component';
import { SpecialDealComponent } from "../../admin/special-deal/special-deal.component";
import { IntegrationLogsComponent } from "../../admin/integration-logs/integration-logs.component";
import { PremaidComponent } from "../../admin/premaidCalc/premaid-calc.component";
import { CompanyPlansComponent } from "../../admin/plans/company-plans/company-plans.component";
import { HelloBarComponent } from "../../admin/hello-bar/hello-bar.component";
import { FeatureComponent } from '../../admin/features/features.component';
import { SheetsComponent } from '../../admin/sheets/sheets.component';
import { CacheHandlingComponent } from '../../admin/cache-handling/cache-handling.component'
import { CancelRequestComponent } from '../../admin/canel-request/cancel-request.component'

import { EventsComponent } from '../../admin/events/events.component';
import {AppSearchComponent} from '../../admin/app-search/app-search.component'

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: 'graph',
            component: BasicComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'sub-admin',
            component: SubAdminComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'users',
            component: AllUsersComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'user/:id',
            component: SingleUserComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'subadmin/:id',
            component: SingleadminComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'companies',
            component: AllCompaniesComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'company/:id',
            component: SingleCompanyComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'plans',
            component: PlansComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'company_plans',
            component: CompanyPlansComponent,
            canActivate: [AdminGuard, AdminLtdGuard]
          },
          {
            path: 'features',
            component: AllFeaturesComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'subdomains',
            component: SubDomainComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'emailLogs',
            component: EmailLogsComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'leads',
            component: LeadsComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'couponcode',
            component: CouponsComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'sitesettings',
            component: SitesettingsComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'successrate',
            component: SuccessRateComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'errorLogs',
            component: LogComponent,
            canActivate: [AdminGuard, AdminLtdGuard]
          },
          {
            path: 'locales-admin',
            component: LocalesAdminComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'customJSApprovals',
            component: CustomJsApprovalsComponent,
            canActivate: [AdminGuard, AdminLtdGuard]
          },
          {
            path: 'responseLogs',
            component: LogComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'searchcalc',
            component: SearchCalcComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'promotion-checklist',
            component: PromotionChecklist,
            canActivate: [AdminGuard]
          },
          {
            path: 'integration-logs',
            component: IntegrationLogsComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'londoner',
            component: LondonerComponent,
            canActivate: [AdminGuard, AdminLtdGuard]
          },
          {
            path: 'hello-bar',
            component: HelloBarComponent
          },
          {
            path: 'specialDeals',
            component: SpecialDealComponent,
            canActivate: [AdminGuard]
          },
          {
            path: '#premaidcalc',
            component: PremaidComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'premades-features/:type',
            component: FeatureComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'layout-preview',
            component: LayoutPreviewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'sheets',
            component: SheetsComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'cache-handling',
            component:CacheHandlingComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'app-search',
            component: AppSearchComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'events',
            component: EventsComponent,
            canActivate: [AdminGuard, AdminLtdGuard],
          },
          {
            path: 'cancel-request',
            component:CancelRequestComponent,
            canActivate: [AdminGuard]
          }
        ]
      },
    ]
  }
];

export const ADMIN_PROVIDERS = [AdminGuard, AdminLtdGuard];

