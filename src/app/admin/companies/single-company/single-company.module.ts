import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
// importing components
import {SingleCompanyComponent} from "./single-company.component";
import {CalculatorDetailComponent} from "./components/calculators-detail/calculators-detail.component";
import {CompanyDetailComponent} from "./components/company-detail/company-detail.component";
import {MembershipDetailComponent} from "./components/membership-detail/membership-details.component";
import {TeamDetailComponent} from "./components/team-detail/team-detail.component";
import {CompanyFeatureComponent} from "./components/company-feature/company-feature.component";

import {SharedModule} from "./../../../shared/modules/shared.module";
import {IntegrationDetailComponent} from "./components/integration-detail/integration-detail.component";
import {ChildCompaniesComponent} from "./components/child-companies/child-companies.component";
import {CompanylogComponent} from "./components/company-log/companylog.component";
import { CompanyPremadesComponent } from './components/company-premades/company-premades.component';
import { CompanyFeaturesNewComponent } from './components/company-features-new/company-features-new.component';
import { CompanyPremadesNewComponent } from './components/company-premades-new/company-premades-new.component';
import { UsageCycleComponent } from "./components/usage-cycle/usage-cycle.component";
import { AgencyComponent } from './components/agency/agency.component';
//import { FeatureLayoutManagerComponent } from './components/feature-layout-manager/feature-layout-manager.component';
@NgModule({
  imports : [ RouterModule, SharedModule],
  declarations : [SingleCompanyComponent, CalculatorDetailComponent,
    CompanyDetailComponent, MembershipDetailComponent, TeamDetailComponent, CompanyFeatureComponent, IntegrationDetailComponent,
     ChildCompaniesComponent,CompanylogComponent, CompanyPremadesComponent, CompanyFeaturesNewComponent, CompanyPremadesNewComponent,UsageCycleComponent, AgencyComponent],
  })

export class SingleCompanyModule {}
