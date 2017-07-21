import { NgModule } from '@angular/core';

// importing components
import {DomainComponent} from './component/domain.component';
import {SubDomainComponent} from './subdomain.component';
// importing services
import {DomainService} from './../../shared/services/domains.service';

import {SharedModule} from './../../shared/modules/shared.module';




@NgModule({

  imports: [SharedModule],
  declarations: [DomainComponent, SubDomainComponent],
  providers: [DomainService]

})

export class SubDomainModule {}