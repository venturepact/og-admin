import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// importing components
import {SingleadminComponent} from './single-admin.component';
import {AccountDetailsComponent} from './components/account-details/account-details.component';

import {SharedModule} from './../../../shared/modules/shared.module';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [ SingleadminComponent, AccountDetailsComponent]
})

export class SingleadminModule {}
