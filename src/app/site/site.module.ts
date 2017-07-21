import { NgModule } from '@angular/core';
import { NavBarModule } from './components/+navbar/navbar.module';
import { VerifyUserComponent } from './+invitedUser/verifyUser/verifyUser.component';
import { SetPasswordComponent } from './+invitedUser/setPassword/setPassword.component';
import { UserApprovalComponent } from './+invitedUser/userApproval/userApproval.component';
import { ForgetPasswordComponent } from './+forgetPassword/forgetPassword.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SiteComponent } from './site.component';
import { routes } from './../config/routes/index';
import {SharedModule} from './../shared/modules/shared.module';
import { ToolbarModule } from './components/toolbar/toolbar.module';
import {IntegrationService} from './../shared/services/integration.service';
// import { ReferralCandyComponent } from './../shared/referralCandy/referralCandy.component';

@NgModule({
  declarations: [
    SiteComponent,
    VerifyUserComponent,
    SetPasswordComponent,
    UserApprovalComponent,
    ForgetPasswordComponent,
    VerifyEmailComponent
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
