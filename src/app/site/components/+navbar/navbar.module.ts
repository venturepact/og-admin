import {SharedModule} from './../../../shared/modules/shared.module';
import { NgModule } from '@angular/core';

import { routes } from './../../../config/routes/index';
import { CompanyNavbarComponent,SiteNavbarComponent } from './index';

@NgModule({
  declarations: [CompanyNavbarComponent, SiteNavbarComponent],
  imports: [
    routes,
    SharedModule
  ],
  exports: [CompanyNavbarComponent, SiteNavbarComponent],
  providers: []
})
export class NavBarModule { }
