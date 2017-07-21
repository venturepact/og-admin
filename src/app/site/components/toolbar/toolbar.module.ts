import {NgModule} from '@angular/core';
import {CompanyService} from '../../../shared/services/company.service';
import {UserService} from '../../../shared/services/user.service';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PremiumModalComponent} from './../../../shared/premiumModal/premiumModal.component';
import {ToolbarComponent} from './toolbar.component';
import {PaymentModalModule} from '../../../shared/paymentModal/paymentModal.module';
import {cardPlanModalComponent} from './../../../shared/cardPlanModal/cardPlanModal.component';

import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule, SharedModule, PaymentModalModule],
  declarations: [ToolbarComponent, PremiumModalComponent, cardPlanModalComponent],
  providers: [UserService, CompanyService],
  exports:[ToolbarComponent]
})

export class ToolbarModule {
}
