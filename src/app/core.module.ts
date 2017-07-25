import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {SharedModule} from './shared/modules/shared.module';
import {UserService} from './shared/services/user.service';
import {LoggedInService} from './shared/services/logged-in.service';
import {SettingsCommunicationService} from './shared/services/settings.communication.service';
import {MembershipService} from './shared/services/membership.service';
import {CookieService} from './shared/services/cookie.service';
import {CompanyService} from './shared/services/company.service';
import {Script} from './shared/services/script.service';
import {SubDomainService} from "./shared/services/subdomain.service";

@NgModule({
  exports: [SharedModule]
})

export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [UserService, LoggedInService, SettingsCommunicationService,
        MembershipService, CompanyService, CookieService, Script, SubDomainService]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
